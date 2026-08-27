import React, { useState } from 'react';
import { Card, Title, Text, Metric, AreaChart, Badge } from '@tremor/react';
import { useChaosPipeline } from './useChaosPipeline';

export default function BITDashboard() {
  const { isChaosActive, toggleChaos, chartData, metrics } = useChaosPipeline();
  const [slotBooked, setSlotBooked] = useState(false);
  const [bookingStatus, setBookingStatus] = useState('');

  const handleBookSlot = () => {
    if (slotBooked) return;
    
    setBookingStatus('Securing database row lock...');
    setTimeout(() => {
      setSlotBooked(true);
      setBookingStatus('VIP Slot #001 Successfully Claimed!');
    }, 150);
  };

  return (
    <div className="min-h-screen p-6 font-mono bg-slate-950 text-slate-100 md:p-12">
      
      {/* HEADER BAR */}
      <div className="flex flex-col items-start justify-between gap-4 pb-8 mb-8 border-b md:flex-row md:items-center border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <Title className="text-2xl font-bold text-white">BIT // Booking Interface Terminal</Title>
            <Badge color={isChaosActive ? "red" : "emerald"}>
              {isChaosActive ? "CHAOS MODE ACTIVE" : "SYSTEM STABLE"}
            </Badge>
          </div>
          <Text className="text-slate-400">High-Concurrency Database Lock & Traffic Telemetry</Text>
        </div>

        {/* CHAOS TOGGLE BUTTON */}
        <button
          onClick={toggleChaos}
          className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
            isChaosActive
              ? 'bg-red-500/10 border-red-500 text-red-400 hover:bg-red-500/20'
              : 'bg-emerald-500/10 border-emerald-500 text-emerald-400 hover:bg-emerald-500/20'
          }`}
        >
          {isChaosActive ? 'Disable Chaos Mode' : 'Initialize Chaos Mode'}
        </button>
      </div>

      {/* METRICS OVERVIEW */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
        <Card className="bg-slate-900 border-slate-800">
          <Text className="text-slate-400">Current Traffic Rate</Text>
          <Metric className="text-white">{metrics.currentRps.toLocaleString()} <span className="text-xs font-normal text-slate-400">req/s</span></Metric>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <Text className="text-slate-400">Buffered Pipeline Requests</Text>
          <Metric className="text-white">{metrics.totalReqs.toLocaleString()}</Metric>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <Text className="text-slate-400">Database Lock Strategy</Text>
          <Metric className="text-amber-400">Pessimistic</Metric>
        </Card>
      </div>

      {/* REAL-TIME TREMOR CHART */}
      <Card className="mb-8 bg-slate-900 border-slate-800">
        <Title className="mb-2 text-white">Live Traffic Volume</Title>
        <AreaChart
          className="mt-4 h-72"
          data={chartData}
          index="time"
          categories={["Simulated Traffic (req/s)"]}
          colors={[isChaosActive ? "red" : "emerald"]}
          valueFormatter={(number) => `${number.toLocaleString()} req/s`}
          showLegend={false}
        />
      </Card>

      {/* SNEAKER DROP / VIP ACCESS ACTION PANEL */}
      <Card className="py-10 text-center bg-slate-900 border-slate-800">
        <Title className="mb-2 text-xl text-white">Exclusive VIP Access Drop</Title>
        <Text className="mb-6 text-slate-400">Slot #001 Available — High Concurrency Lock Ready</Text>

        <button
          onClick={handleBookSlot}
          disabled={slotBooked}
          className={`px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
            slotBooked
              ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              : 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-lg shadow-amber-400/20'
          }`}
        >
          {slotBooked ? 'SLOT CLAIMED' : 'CLAIM VIP SLOT NOW'}
        </button>

        {bookingStatus && (
          <p className="mt-4 text-xs font-semibold text-amber-300 animate-pulse">
            {bookingStatus}
          </p>
        )}
      </Card>

    </div>
  );
}