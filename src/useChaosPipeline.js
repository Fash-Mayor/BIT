import { useState, useEffect, useRef, useCallback } from 'react';

const DB_NAME = 'BIT_ChaosDB';
const STORE_NAME = 'telemetry_logs';

export function useChaosPipeline() {
  const [isChaosActive, setIsChaosActive] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [metrics, setMetrics] = useState({ totalReqs: 0, currentRps: 0 });
  const workerRef = useRef(null);
  const dbRef = useRef(null);

  // Initialize IndexedDB
  useEffect(() => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = (e) => {
      dbRef.current = e.target.result;
    };
  }, []);

  // Initialize Web Worker via Blob (No separate file setup needed!)
  useEffect(() => {
    const workerCode = `
      let active = false;
      let totalRequests = 0;

      self.onmessage = (e) => {
        if (e.data.command === 'START') {
          active = true;
          runPipeline();
        } else if (e.data.command === 'STOP') {
          active = false;
        }
      };

      function runPipeline() {
        if (!active) return;
        const start = performance.now();
        let ops = 0;

        // Simulate high-concurrency request payload generation
        while (performance.now() - start < 100) {
          Math.sin(Math.random() * 1000) * Math.cos(Math.random() * 1000);
          ops += Math.floor(Math.random() * 15) + 5;
        }

        totalRequests += ops;

        self.postMessage({
          rps: ops * 10,
          total: totalRequests,
          timestamp: new Date().toLocaleTimeString([], { hour12: false, minute:'2-digit', second:'2-digit' })
        });

        setTimeout(runPipeline, 100);
      }
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));

    worker.onmessage = (e) => {
      const log = e.data;
      
      // Push telemetry directly to IndexedDB buffer
      if (dbRef.current) {
        const tx = dbRef.current.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).add(log);
      }

      // Update React Chart State
      setMetrics({ totalReqs: log.total, currentRps: log.rps });
      setChartData((prev) => {
        const updated = [...prev, { time: log.timestamp, "Simulated Traffic (req/s)": log.rps }];
        return updated.slice(-20); // Keep last 20 data points on the chart
      });
    };

    workerRef.current = worker;

    return () => worker.terminate();
  }, []);

  const toggleChaos = useCallback(() => {
    if (!workerRef.current) return;
    if (isChaosActive) {
      workerRef.current.postMessage({ command: 'STOP' });
      setIsChaosActive(false);
    } else {
      workerRef.current.postMessage({ command: 'START' });
      setIsChaosActive(true);
    }
  }, [isChaosActive]);

  return { isChaosActive, toggleChaos, chartData, metrics };
}