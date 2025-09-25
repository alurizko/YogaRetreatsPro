import { useEffect, useState } from 'react'
import { getTableData } from '@/lib/database'

interface UserRow {
  id: string | number
  name?: string
  email?: string
}

export default function UsersList() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUsers() {
      const usersData = await getTableData<UserRow>('users')
      setUsers(usersData)
      setLoading(false)
    }

    fetchUsers()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name || user.email || user.id}</li>
        ))}
      </ul>
    </div>
  )
}
