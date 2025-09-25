typescript
 复制
 插入
 新文件

// components/Layout.tsx
import { Outlet } from 'react-router-dom'
import Header from './Header'
import { memo } from 'react'

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  )
}

export default memo(Layout)