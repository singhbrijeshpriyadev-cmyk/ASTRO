'use client';

import React from 'react';
import { KundaliData } from '@/types/astrology';
import { DivisionalChartsView } from './DivisionalChartsView';

interface VargaGridProps {
  kundali: KundaliData;
  chartStyle?: 'north' | 'south' | 'east';
}

export function VargaGrid({ kundali, chartStyle = 'north' }: VargaGridProps) {
  return <DivisionalChartsView kundali={kundali} initialChartStyle={chartStyle} />;
}
