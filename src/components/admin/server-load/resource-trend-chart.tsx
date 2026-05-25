/**
 * ECharts 资源使用趋势图组件
 * 用于展示 CPU、内存、JVM 的历史趋势（多折线对比）
 */

import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import type { LoadHistoryRecord } from '#/api/types/api-mc/server-load'

type ResourceTrendChartProps = {
  records: LoadHistoryRecord[]
  height?: number
  title?: string
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

export function ResourceTrendChart({
  records,
  height = 360,
  title = '资源使用趋势',
}: ResourceTrendChartProps) {
  const option: EChartsOption = useMemo(() => {
    const times = records.map((r) => r.minute_time.slice(11, 16))
    const cpuValues = records.map((r) =>
      Number(r.cpu_usage_avg.toFixed(1)),
    )
    const memValues = records.map((r) => r.mem_used_avg / (1024 * 1024))
    const jvmValues = records.map((r) => r.jvm_used_avg / (1024 * 1024))

    const memTotalMB = records.length > 0
      ? Math.max(...records.map((r) =>
          r.samples.length > 0
            ? Math.max(...r.samples.map((s) => s.mem_total_bytes))
            : 0,
        )) / (1024 * 1024)
      : 0

    const jvmMaxMB = records.length > 0
      ? Math.max(...records.map((r) =>
          r.samples.length > 0
            ? Math.max(...r.samples.map((s) => s.jvm_max_bytes))
            : 0,
        )) / (1024 * 1024)
      : 0

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
      },
      legend: {
        top: 28,
        textStyle: { color: '#94a3b8', fontSize: 11 },
        itemWidth: 16,
        itemHeight: 8,
      },
      grid: {
        top: 64,
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
      yAxis: [
        {
          type: 'value',
          name: 'CPU %',
          nameTextStyle: { color: '#64748b', fontSize: 10 },
          min: 0,
          max: 100,
          axisLine: { show: false },
          splitLine: { lineStyle: { color: '#1e293b' } },
          axisLabel: { color: '#64748b', fontSize: 10 },
        },
        {
          type: 'value',
          name: 'MB',
          nameTextStyle: { color: '#64748b', fontSize: 10 },
          axisLine: { show: false },
          splitLine: { show: false },
          axisLabel: { color: '#64748b', fontSize: 10 },
        },
      ],
      series: [
        {
          name: 'CPU 使用率',
          type: 'line',
          data: cpuValues,
          smooth: true,
          symbol: 'circle',
          symbolSize: 3,
          lineStyle: { color: '#ef4444', width: 2 },
          itemStyle: { color: '#ef4444' },
        },
        {
          name: '物理内存',
          type: 'line',
          yAxisIndex: 1,
          data: memValues.map((v) => Number(v.toFixed(1))),
          smooth: true,
          symbol: 'circle',
          symbolSize: 3,
          lineStyle: { color: '#3b82f6', width: 2 },
          itemStyle: { color: '#3b82f6' },
          markLine: memTotalMB > 0 ? {
            silent: true,
            symbol: 'none',
            lineStyle: { color: '#3b82f6', type: 'dashed', width: 1, opacity: 0.5 },
            data: [{
              yAxis: Number(memTotalMB.toFixed(1)),
              label: {
                formatter: `物理内存总量 ${formatBytes(memTotalMB * 1024 * 1024)}`,
                fontSize: 10,
                color: '#3b82f6',
                position: 'insideEndTop',
              },
            }],
          } : undefined,
        },
        {
          name: 'JVM 内存',
          type: 'line',
          yAxisIndex: 1,
          data: jvmValues.map((v) => Number(v.toFixed(1))),
          smooth: true,
          symbol: 'circle',
          symbolSize: 3,
          lineStyle: { color: '#a855f7', width: 2 },
          itemStyle: { color: '#a855f7' },
          markLine: jvmMaxMB > 0 ? {
            silent: true,
            symbol: 'none',
            lineStyle: { color: '#a855f7', type: 'dashed', width: 1, opacity: 0.5 },
            data: [{
              yAxis: Number(jvmMaxMB.toFixed(1)),
              label: {
                formatter: `JVM 最大 ${formatBytes(jvmMaxMB * 1024 * 1024)}`,
                fontSize: 10,
                color: '#a855f7',
                position: 'insideEndTop',
              },
            }],
          } : undefined,
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

export { formatBytes }
