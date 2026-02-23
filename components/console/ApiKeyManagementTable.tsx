'use client'

import type { APIKey } from '@/types'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  ScrollShadow,
  Tooltip,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from '@heroui/react'
import { format } from 'date-fns'
import {
  KeyRound,
  Trash2,
  RotateCcw,
  ShieldOff,
  ShieldCheck,
  User,
  Edit3,
} from 'lucide-react'
import { useState } from 'react'
import {
  revokeApiKey,
  reactivateApiKey,
  deleteApiKey,
} from '@/app/actions/apiKeyActions'

interface ApiKeyManagementTableProps {
  apiKeys: APIKey[]
  onActionComplete: () => void
}

export function ApiKeyManagementTable({
  apiKeys,
  onActionComplete,
}: ApiKeyManagementTableProps) {
  const [selectedKey, setSelectedKey] = useState<APIKey | null>(null)
  const {
    isOpen: isRevokeModalOpen,
    onOpen: onRevokeModalOpen,
    onClose: onRevokeModalClose,
    onOpenChange: onRevokeModalOpenChange,
  } = useDisclosure()
  const {
    isOpen: isReactivateModalOpen,
    onOpen: onReactivateModalOpen,
    onClose: onReactivateModalClose,
    onOpenChange: onReactivateModalOpenChange,
  } = useDisclosure()
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
    onOpenChange: onDeleteModalOpenChange,
  } = useDisclosure()

  const openModal = (
    key: APIKey,
    modalType: 'revoke' | 'reactivate' | 'delete',
  ) => {
    setSelectedKey(key)
    if (modalType === 'revoke') onRevokeModalOpen()
    else if (modalType === 'reactivate') onReactivateModalOpen()
    else if (modalType === 'delete') onDeleteModalOpen()
  }

  const handleRevoke = async () => {
    if (!selectedKey) return
    const result = await revokeApiKey(selectedKey.id)
    if (result.success) {
      alert(result.message)
      onActionComplete()
    } else {
      alert(`Error: ${result.message}`)
    }
    onRevokeModalClose()
    setSelectedKey(null)
  }

  const handleReactivate = async () => {
    if (!selectedKey) return
    const result = await reactivateApiKey(selectedKey.id)
    if (result.success) {
      alert(result.message)
      onActionComplete()
    } else {
      alert(`Error: ${result.message}`)
    }
    onReactivateModalClose()
    setSelectedKey(null)
  }

  const handleDelete = async () => {
    if (!selectedKey) return
    const result = await deleteApiKey(selectedKey.id)
    if (result.success) {
      alert(result.message)
      onActionComplete()
    } else {
      alert(`Error: ${result.message}`)
    }
    onDeleteModalClose()
    setSelectedKey(null)
  }

  if (apiKeys.length === 0) {
    return (
      <p className='text-foreground-500'>No API keys found for any user.</p>
    )
  }

  return (
    <>
      <ScrollShadow
        hideScrollBar
        className='h-[600px] w-full border shadow-md rounded-lg'
      >
        <Table aria-label='API Key Management Table' removeWrapper>
          <TableHeader>
            <TableColumn>USER</TableColumn>
            <TableColumn>KEY NAME / ID</TableColumn>
            <TableColumn>PUBLIC KEY PREFIX</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>CREATED AT</TableColumn>
            <TableColumn>LAST USED</TableColumn>
            <TableColumn className='text-right'>
              ACTIONS
            </TableColumn>
          </TableHeader>
          <TableBody items={apiKeys} emptyContent='No API keys found.'>
            {(key) => (
              <TableRow key={key.id}>
                <TableCell>
                  <div>{key.userName || 'N/A'}</div>
                  <div className='text-xs text-foreground-500'>
                    {key.userEmail || key.userId}
                  </div>
                </TableCell>
                <TableCell>
                  <div>{key.name || 'Untitled Key'}</div>
                  <div className='text-xs text-foreground-500'>{key.id}</div>
                </TableCell>
                <TableCell className='font-mono'>
                  {key.publicKey.substring(0, 12)}...
                </TableCell>
                <TableCell>
                  <Chip
                    size='sm'
                    color={key.isActive ? 'success' : 'danger'}
                    variant='flat'
                  >
                    {key.isActive ? 'Active' : 'Revoked'}
                  </Chip>
                </TableCell>
                <TableCell>
                  {format(new Date(key.createdAt), 'PPp')}
                </TableCell>
                <TableCell>
                  {key.lastUsedAt
                    ? format(new Date(key.lastUsedAt), 'PPp')
                    : 'Never'}
                </TableCell>
                <TableCell className='text-right space-x-1'>
                  {key.isActive ? (
                    <Tooltip content='Revoke Key' placement='top'>
                      <Button
                        isIconOnly
                        size='sm'
                        variant='light'
                        color='warning'
                        onPress={() => openModal(key, 'revoke')}
                        aria-label='Revoke API Key'
                      >
                        <ShieldOff className='h-4 w-4' />
                      </Button>
                    </Tooltip>
                  ) : (
                    <Tooltip content='Reactivate Key' placement='top'>
                      <Button
                        isIconOnly
                        size='sm'
                        variant='light'
                        color='success'
                        onPress={() => openModal(key, 'reactivate')}
                        aria-label='Reactivate API Key'
                      >
                        <ShieldCheck className='h-4 w-4' />
                      </Button>
                    </Tooltip>
                  )}

                  <Tooltip content='Delete Key' placement='top'>
                    <Button
                      isIconOnly
                      size='sm'
                      variant='light'
                      color='danger'
                      onPress={() => openModal(key, 'delete')}
                      aria-label='Delete API Key'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollShadow>

      <Modal
        isOpen={isRevokeModalOpen}
        onOpenChange={onRevokeModalOpenChange}
        backdrop='blur'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Revoke API Key?
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to revoke the API key{' '}
                  <span className='font-semibold'>
                    {selectedKey?.name ||
                      selectedKey?.publicKey.substring(0, 12)}
                    ...
                  </span>
                  ?
                </p>
                <p>This will prevent it from being used to access the API.</p>
              </ModalBody>
              <ModalFooter>
                <Button variant='light' onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color='warning'
                  onPress={handleRevoke}
                  className='shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0.5 transition-transform duration-150 ease-in-out'
                >
                  Revoke Key
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isReactivateModalOpen}
        onOpenChange={onReactivateModalOpenChange}
        backdrop='blur'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Reactivate API Key?
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to reactivate the API key{' '}
                  <span className='font-semibold'>
                    {selectedKey?.name ||
                      selectedKey?.publicKey.substring(0, 12)}
                    ...
                  </span>
                  ?
                </p>
                <p>This will allow it to be used to access the API again.</p>
              </ModalBody>
              <ModalFooter>
                <Button variant='light' onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color='success'
                  onPress={handleReactivate}
                  className='text-white shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0.5 transition-transform duration-150 ease-in-out'
                >
                  Reactivate Key
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteModalOpenChange}
        backdrop='blur'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Delete API Key?
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to{' '}
                  <span className='font-bold text-danger-500'>
                    permanently delete
                  </span>{' '}
                  the API key{' '}
                  <span className='font-semibold'>
                    {selectedKey?.name ||
                      selectedKey?.publicKey.substring(0, 12)}
                    ...
                  </span>
                  ?
                </p>
                <p className='text-danger-500'>This action cannot be undone.</p>
              </ModalBody>
              <ModalFooter>
                <Button variant='light' onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color='danger'
                  onPress={handleDelete}
                  className='text-white shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0.5 transition-transform duration-150 ease-in-out'
                >
                  Delete Key
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
