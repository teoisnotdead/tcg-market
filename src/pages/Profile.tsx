import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useUser } from '../context/UserProvider'
import { toLocalString } from '../utils/toLocalString'

export const Profile: React.FC = () => {
  const { userStats, name, getUserStats } = useUser()

  useEffect(() => {
    getUserStats()
  }, [getUserStats])

  return (
    <div className='min-h-[100vh] flex-1 p-6'>
      <h1 className='text-2xl font-bold mb-6'>¡Hola {name}!</h1>

      {!userStats ? (
        // Skeletons mientras carga
        <div className='grid gap-4 md:grid-cols-3'>
          <Skeleton className='h-24 rounded-lg' />
          <Skeleton className='h-24 rounded-lg' />
          <Skeleton className='h-24 rounded-lg' />
        </div>
      ) : (
        // Datos cargados
        <div className='grid gap-4 md:grid-cols-3'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Ventas Activas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-3xl font-bold'>{userStats.sales.active}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Ventas Completadas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-3xl font-bold'>{userStats.sales.sold}</p>
              <p className='text-muted-foreground'>
                Total ganado: {toLocalString(userStats.sales.total_earned)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Compras Realizadas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-3xl font-bold'>
                {userStats.purchases.total_purchases}
              </p>
              <p className='text-muted-foreground'>
                Total gastado: {toLocalString(userStats.purchases.total_spent)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 