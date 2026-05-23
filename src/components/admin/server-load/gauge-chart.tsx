/**
 * ECharts 实时仪表盘组件
 * 用于展示 CPU 使用率、内存使用率等百分比指标
 */

import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'

type GaugeChartProps = {
  value: number
  max?: number
  label: string
  color?: string
  size?: number
}

export function GaugeChart({
  value,
  max = 100,
  label,
  color = '#10b981',
  size = 180,
}: GaugeChartProps) {
  const option: EChartsOption = useMemo(
    () => ({
      series: [
        {
          type: 'gauge',
          startAngle: 200,
          endAngle: -20,
          min: 0,
          max,
          radius: '90%',
          splitNumber: 5,
          axisLine: {
            lineStyle: {
              width: 14,
              color: [
                [0.3, '#10b981'],
                [0.7, '#f59e0b'],
                [1, '#ef4444'],
              ],
            },
          },
          pointer: {
            icon: 'circle',
            length: '12%',
            width: 30,
            offsetCenter: [0, '-60%'],
            itemStyle: {
              color: 'auto',
            },
          },
          axisTick: {
            length: 8,
            lineStyle: {
              color: 'auto',
              width: 1,
            },
          },
          splitLine: {
            length: 14,
            lineStyle: {
              color: 'auto',
              width: 2,
            },
          },
          axisLabel: {
            color: '#999',
            fontSize: 10,
            distance: 18,
            formatter: (val: number) => `${Math.round(val)}%`,
          },
          detail: {
            valueAnimation: true,
            formatter: `{value}%`,
            color,
            fontSize: 20,
            fontWeight: 'bold',
            offsetCenter: [0, '30%'],
          },
          title: {
            offsetCenter: [0, '60%'],
            fontSize: 12,
            color: '#999',
          },
          data: [{ value: Math.round(value), name: label }],
        },
      ],
    }),
    [value, max, label, color],
  )

  return (
    <ReactECharts
      option={option}
      style={{ width: size, height: size }}
      opts={{ renderer: 'svg' }}
      notMerge
    />
  )
}
