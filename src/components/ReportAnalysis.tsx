import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { name: '開発', 時間: 40 },
  { name: 'ミーティング', 時間: 15 },
  { name: 'ドキュメンテーション', 時間: 10 },
  { name: 'レビュー', 時間: 8 },
  { name: 'その他', 時間: 7 },
]

export function ReportAnalysis() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">今月の業務分布</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="時間" fill="#8A2BE2" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

