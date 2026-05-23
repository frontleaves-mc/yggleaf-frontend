/**
 * ECharts TPS 折线图组件
 * 用于展示 TPS 实时/历史趋势
 */

import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import type { LoadHistoryRecord } from '#/api/types/api-mc/server-load'

type TpsTrendChartProps = {
  records: LoadHistoryRecord[]
  height?: number
  title?: string
}

export function TpsTrendChart({
  records,
  height = 360,
  title = 'TPS 趋势',
}: TpsTrendChartProps) {
  const option: EChartsOption = useMemo(() => {
    const times = records.map((r) =>
      r.minute_time.slice(11, 16),
    )
    const tpsValues = records.map((r) =>
      Number(r.tps_avg.toFixed(1)),
    )

    return {
      title: {
        text: title,
        left: 'center',
        textStyle: { fontSize: 13, fontWeight: 600, color: '#94a3b8' },
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        borderColor: '#334155',
        padding: [10, 14],
        textStyle: { color: '#e2e8f0', fontSize: 13 },
        formatter: (params: unknown) => {
          const p = (params as { name: string; value: number }[])[0]
          return `${p.name}<br/>TPS: <b>${p.value}</b>`
        },
      },
      grid: {
        top: 48,
        right: 24,
        bottom: 32,
        left: 52,
      },
      xAxis: {
        type: 'category',
        data: times,
        axisLine: { lineStyle: { color: '#334155' } },
        axisLabel: { color: '#64748b', fontSize: 10 },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 22,
        axisLine: { show: false },
        splitLine: { lineStyle: { color: '#1e293b' } },
        axisLabel: { color: '#64748b', fontSize: 10 },
      },
      series: [
        {
          name: 'TPS',
          type: 'line',
          data: tpsValues,
          smooth: true,
          symbol: 'circle',
          symbolSize: 4,
          lineStyle: { color: '#10b981', width: 2 },
          itemStyle: { color: '#10b981' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(16, 185, 129, 0.25)' },
                { offset: 1, color: 'rgba(16, 185, 129, 0.02)' },
              ],
            },
          },
          markLine: {
            silent: true,
            lineStyle: { color: '#f59e0b', type: 'dashed', width: 1 },
            data: [{ yAxis: 20, label: { formatter: '理想 20', fontSize: 10, color: '#f59e0b' } }],
          },
        },
      ],
    }
  }, [records, title])

  return (
    <ReactECharts
      option={option}
      style={{ width: '100%', height }}
      opts={{ renderer: 'svg' }}
      notMerge
    />
  )
}
