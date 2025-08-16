
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Spinner, Card, CardHeader, CardBody, CardFooter, Button as NextUIButton, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input as NextUIInput, Select as NextUISelect, SelectItem as NextUISelectItem, useDisclosure, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Tooltip } from "@nextui-org/react";
import { Users2, ShieldAlert, Edit, AlertTriangle } from "lucide-react";
import { getConsoleUsers, updateConsoleUserDetails } from "@/app/actions/userActions";
import type { User, ConsoleUserUpdateFormValues } from "@/types";
import { format } from "date-fns";

export default function TeamManagementPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [consoleUsers, setConsoleUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose, onOpenChange: onEditModalOpenChange } = useDisclosure();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [editForm, setEditForm] = useState({ firstName: "", lastName: "", phoneNumber: "", role: "manager" as User['role']});

  const fetchConsoleUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    setError(null);
    try {
      const users = await getConsoleUsers();
      setConsoleUsers(users);
    } catch (err) {
      setError("Failed to load console users.");
      console.error(err);
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'cto') {
        router.push('/console/dashboard');
      } else {
        fetchConsoleUsers();
      }
    }
  }, [user, authLoading, router, fetchConsoleUsers]);
  
  const handleOpenEditModal = (userToEdit: User) => {
    setEditingUser(userToEdit);
    setEditForm({
        firstName: userToEdit.firstName || "",
        lastName: userToEdit.lastName || "",
        phoneNumber: userToEdit.phoneNumber || "",
        role: userToEdit.role
    });
    setSubmissionStatus(null);
    onEditModalOpen();
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    setIsSubmitting(true);
    setSubmissionStatus(null);
    
    const dataToUpdate: ConsoleUserUpdateFormValues = {
        uid: editingUser.id,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        phoneNumber: editForm.phoneNumber,
        role: editForm.role as "cto" | "administrator" | "manager"
    };

    const result = await updateConsoleUserDetails(dataToUpdate);

    if (result.success) {
      setSubmissionStatus({ type: 'success', message: result.message });
      fetchConsoleUsers();
      setTimeout(() => onEditModalClose(), 1500);
    } else {
      setSubmissionStatus({ type: 'error', message: result.message });
    }
    
    setIsSubmitting(false);
  };


  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Spinner label="Loading Team Management..." color="warning" labelColor="warning" />
      </div>
    );
  }

  if (user?.role !== 'cto') {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="max-w-md p-4 bg-danger-50 border-danger-200">
          <CardHeader className="flex items-center">
            <ShieldAlert className="h-8 w-8 text-danger mr-3" />
            <h1 className="text-xl font-semibold text-danger-700">Access Denied</h1>
          </CardHeader>
          <CardBody>
            <p className="text-danger-600">You do not have permission to view this page. Access is restricted to CTOs.</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <>
    <div className="space-y-8">
      <div className="flex flex-col space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center">
          <Users2 className="mr-3 h-8 w-8 text-primary" />
          Team Management
        </h1>
        <p className="text-foreground-500">
          Manage console user accounts, roles, and permissions. (Visible only to CTO)
        </p>
      </div>

      <Card className="shadow-xl rounded-xl bg-background">
        <CardHeader className="px-6 pt-6 pb-2">
           <div className="flex flex-col space-y-0.5">
                <h2 className="text-xl font-semibold text-primary">Console Users</h2>
                <p className="text-sm text-foreground-500 mt-1">
                    A list of all users with access to the console.
                </p>
            </div>
        </CardHeader>
        <CardBody className="p-2 md:p-4">
          {isLoadingUsers && <Spinner label="Loading users..." color="warning" />}
          {error && !isLoadingUsers && (
                <Card className="mt-8 bg-danger-50 border-danger-200 rounded-xl">
                    <CardBody className="p-4">
                        <div className="flex items-center">
                            <AlertTriangle className="h-5 w-5 text-danger mr-3" />
                            <div>
                                <p className="font-semibold text-danger-700">Error</p>
                                <p className="text-sm text-danger-600">{error}</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            )}
           {!isLoadingUsers && !error && (
               <Table aria-label="Console Users Table" removeWrapper>
                    <TableHeader>
                        <TableColumn>NAME</TableColumn>
                        <TableColumn>EMAIL</TableColumn>
                        <TableColumn>ROLE</TableColumn>
                        <TableColumn>LAST LOGIN</TableColumn>
                        <TableColumn>ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody items={consoleUsers} emptyContent="No console users found.">
                        {(item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-semibold">{item.name}</TableCell>
                                <TableCell>{item.email}</TableCell>
                                <TableCell>
                                    <Chip size="sm" variant="flat" color={item.role === 'cto' ? 'secondary' : item.role === 'administrator' ? 'primary' : 'default'}>
                                        {item.role}
                                    </Chip>
                                </TableCell>
                                <TableCell>
                                    {item.lastLogin ? format(item.lastLogin, "PPpp") : 'Never'}
                                </TableCell>
                                <TableCell>
                                    <Tooltip content="Edit User Details">
                                        <NextUIButton isIconOnly size="sm" variant="light" color="secondary" onPress={() => handleOpenEditModal(item)}>
                                            <Edit className="h-4 w-4" />
                                        </NextUIButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )}
        </CardBody>
      </Card>
    </div>

    <Modal isOpen={isEditModalOpen} onOpenChange={onEditModalOpenChange} backdrop="blur">
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1 text-primary">Edit Console User</ModalHeader>
                    <ModalBody>
                        {submissionStatus && (
                            <Card className={`mb-4 ${submissionStatus.type === 'success' ? 'bg-success-50' : 'bg-danger-50'}`}>
                                <CardBody className="p-3 text-sm">
                                    <p className={submissionStatus.type === 'success' ? 'text-success-700' : 'text-danger-700'}>
                                        {submissionStatus.message}
                                    </p>
                                </CardBody>
                            </Card>
                        )}
                        <p className="text-sm text-foreground-500">
                            You are editing the profile for <span className="font-bold">{editingUser?.email}</span>.
                        </p>
                        <div className="space-y-4 pt-2">
                           <Input
                                label="First Name"
                                value={editForm.firstName}
                                onValueChange={(v) => setEditForm({ ...editForm, firstName: v })}
                                variant="bordered"
                            />
                            <Input
                                label="Last Name"
                                value={editForm.lastName}
                                onValueChange={(v) => setEditForm({ ...editForm, lastName: v })}
                                variant="bordered"
                            />
                            <Input
                                label="Phone Number"
                                value={editForm.phoneNumber}
                                onValueChange={(v) => setEditForm({ ...editForm, phoneNumber: v })}
                                variant="bordered"
                            />
                             <NextUISelect
                                label="Role"
                                placeholder="Select a role"
                                selectedKeys={[editForm.role]}
                                onSelectionChange={(keys) => setEditForm({ ...editForm, role: Array.from(keys)[0] as User['role'] })}
                                variant="bordered"
                                color="secondary"
                            >
                                <NextUISelectItem key="manager" value="manager">Manager</NextUISelectItem>
                                <NextUISelectItem key="administrator" value="administrator">Administrator</NextUISelectItem>
                                <NextUISelectItem key="cto" value="cto">CTO</NextUISelectItem>
                            </NextUISelect>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <NextUIButton variant="light" onPress={onClose} disabled={isSubmitting}>
                            Cancel
                        </NextUIButton>
                        <NextUIButton color="warning" onPress={handleUpdateUser} isLoading={isSubmitting} disabled={isSubmitting} className="text-primary">
                            Save Changes
                        </NextUIButton>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
    </Modal>
    </>
  );
}
