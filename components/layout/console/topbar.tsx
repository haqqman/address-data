'use client'

import Link from 'next/link'
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  User,
} from '@heroui/react'
import {
  Users,
  KeyRound,
  LogOut,
  UserCircle,
  LayoutGrid,
  Map,
  Users2,
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/auth-context'
import Image from 'next/image'
import type { ReactNode } from 'react'
import type * as Types from '@/types'

interface NavItem {
  href: string
  label: string
  icon: ReactNode
  roles?: Array<Types.User['role']>
}

const baseNavItems: NavItem[] = [
  {
    href: '/console/dashboard',
    label: 'Review Queue',
    icon: <LayoutGrid className='mr-2 h-4 w-4' />,
  },
  {
    href: '/console/users',
    label: 'User Submissions',
    icon: <Users className='mr-2 h-4 w-4' />,
  },
  {
    href: '/console/api-keys',
    label: 'Manage API Keys',
    icon: <KeyRound className='mr-2 h-4 w-4' />,
  },
  {
    href: '/console/geography',
    label: 'Geography',
    icon: <Map className='mr-2 h-4 w-4' />,
  },
  {
    href: '/console/team',
    label: 'Team Manager',
    icon: <Users2 className='mr-2 h-4 w-4' />,
    roles: ['cto'],
  },
]

export function ConsoleTopbar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut(true)
    } catch (error) {
      console.error('Failed to log out from console', error)
    }
  }

  const navItems = baseNavItems.filter((item) => {
    if (!item.roles) return true
    if (!user) return false
    return item.roles.includes(user.role)
  })

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center'>
        <Link
          href='/console/dashboard'
          className='flex items-center space-x-2 mr-6'
        >
          <Image
            src='https://res.cloudinary.com/seapane-cloud/seapane-bucket/addressdata/meta/addressdata-logomark.svg'
            alt='AddressData Logomark'
            width={24}
            height={24}
            className='text-primary'
          />
          <span className='font-bold text-lg text-primary'>Console</span>
        </Link>
        <nav className='flex items-center space-x-1'>
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant='ghost'
              as={Link}
              href={item.href}
              className={cn(
                'justify-start',
                'shadow-md hover:shadow-lg',
                'hover:-translate-y-px active:translate-y-0.5',
                'transition-all duration-150 ease-in-out',
                'border border-foreground/20',
                pathname === item.href
                  ? 'bg-warning/20 text-black border-warning'
                  : 'text-foreground hover:border-warning hover:bg-warning/10',
              )}
              startContent={item.icon}
            >
              {item.label}
            </Button>
          ))}
        </nav>
        <div className='ml-auto flex items-center space-x-4'>
          {user && (
            <Dropdown placement='bottom-end' backdrop='blur'>
              <DropdownTrigger>
                <Button
                  isIconOnly
                  variant='ghost'
                  className='relative h-8 w-8 rounded-full'
                >
                  <UserCircle className='h-7 w-7 text-primary' />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label='Console User Actions' variant='flat'>
                <DropdownSection showDivider>
                  <DropdownItem
                    isReadOnly
                    key='profile'
                    className='h-14 gap-2 opacity-100 cursor-default'
                  >
                    <User
                      name={user.displayName || 'Console User'}
                      description={user.email}
                      avatarProps={{
                        icon: <UserCircle className='text-primary' />,
                        classNames: { icon: 'text-2xl' },
                      }}
                    />
                  </DropdownItem>
                </DropdownSection>
                <DropdownItem
                  key='logout'
                  color='danger'
                  onPress={handleSignOut}
                  startContent={<LogOut className='h-4 w-4' />}
                >
                  Log out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </div>
    </header>
  )
}
