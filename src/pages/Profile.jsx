import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

export const Profile = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 border-b'>
          <div className='flex items-center gap-2 px-3'>
            <SidebarTrigger />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <Link to='/' className='text-white text-sm hover:underline'>
              Página de inicio
            </Link>
            <Link
              to='/marketplace'
              className='text-white text-sm hover:underline'
            >
              Marketplace
            </Link>
            <Link to='/cart' className='text-white text-sm hover:underline'>
              Carrito
            </Link>
          </div>
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4 pt-0 mt-6'>
          <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
            <div className='aspect-video rounded-xl bg-muted/50' />
            <div className='aspect-video rounded-xl bg-muted/50' />
            <div className='aspect-video rounded-xl bg-muted/50' />
          </div>
          <div className='min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min' />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
