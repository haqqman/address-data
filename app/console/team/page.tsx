
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Spinner, Card, CardHeader, CardBody, CardFooter, Button as NextUIButton, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input as NextUIInput, Select as NextUISelect, SelectItem as NextUISelectItem, useDisclosure, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Tooltip } from "@nextui-org/react";
import { Users2, ShieldAlert, Edit, AlertTriangle, PlusCircle, Trash2 } from "lucide-react";
import { getConsoleUsers, createConsoleUser, updateConsoleUser, deleteConsoleUser } from "@/app/actions/userActions";
import type { User } from "@/types";
import { format } from "date-fns";

// The form values for updating a user, which includes the uid.
type ConsoleUserUpdatePayload = {
    uid: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: "cto" | "administrator" | "manager";
};


export default function TeamManagementPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [consoleUsers, setConsoleUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose, onOpenChange: onEditModalOpenChange } = useDisclosure();
  const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: onAddModalClose, onOpenChange: onAddModalOpenChange } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose, onOpenChange: onDeleteModalOpenChange } = useDisclosure();
  
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  const [addForm, setAddForm] = useState({ email: "", password: "", firstName: "", lastName: "", phoneNumber: "", role: "manager" as User['role']});
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
  
  const handleOpenAddModal = () => {
    setAddForm({ email: "", password: "", firstName: "", lastName: "", phoneNumber: "", role: "manager" });
    setSubmissionStatus(null);
    onAddModalOpen();
  };

  const handleCreateUser = async () => {
    setIsSubmitting(true);
    setSubmissionStatus(null);
    const result = await createConsoleUser(addForm);
    if (result.success) {
      setSubmissionStatus({ type: 'success', message: result.message });
      fetchConsoleUsers();
      setTimeout(() => onAddModalClose(), 1500);
    } else {
      setSubmissionStatus({ type: 'error', message: result.message });
    }
    setIsSubmitting(false);
  };

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
    
    // Correctly construct the payload with the UID
    const dataToUpdate: ConsoleUserUpdatePayload = {
        uid: editingUser.id,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        phoneNumber: editForm.phoneNumber,
        role: editForm.role as "cto" | "administrator" | "manager"
    };

    const result = await updateConsoleUser(dataToUpdate);
    if (result.success) {
      setSubmissionStatus({ type: 'success', message: result.message });
      fetchConsoleUsers();
      setTimeout(() => onEditModalClose(), 1500);
    } else {
      setSubmissionStatus({ type: 'error', message: result.message });
    }
    setIsSubmitting(false);
  };

  const handleOpenDeleteModal = (userToDelete: User) => {
    setDeletingUser(userToDelete);
    onDeleteModalOpen();
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    setIsSubmitting(true);
    const result = await deleteConsoleUser(deletingUser.id);
    if (result.success) {
      alert(result.message);
      fetchConsoleUsers();
    } else {
      alert(`Error: ${result.message}`);
    }
    setIsSubmitting(false);
    onDeleteModalClose();
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
      <div className="flex justify-between items-center">
        <div className="flex flex-col space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center">
            <Users2 className="mr-3 h-8 w-8 text-primary" />
            Team Management
            </h1>
            <p className="text-foreground-500">
            Create, edit, and manage console user accounts. (Visible only to CTO)
            </p>
        </div>
        <NextUIButton 
            onPress={handleOpenAddModal} 
            color="warning" 
            className="text-primary shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0.5 transition-transform duration-150 ease-in-out" 
            startContent={<PlusCircle className="h-4 w-4" />}
        >
             Add New Console User
        </NextUIButton>
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
                                    <div className="flex items-center">
                                        <Tooltip content="Edit User Details">
                                            <NextUIButton isIconOnly size="sm" variant="light" color="secondary" onPress={() => handleOpenEditModal(item)}>
                                                <Edit className="h-4 w-4" />
                                            </NextUIButton>
                                        </Tooltip>
                                        <Tooltip content="Delete User">
                                            <NextUIButton isIconOnly size="sm" variant="light" color="danger" onPress={() => handleOpenDeleteModal(item)} isDisabled={user?.id === item.id}>
                                                <Trash2 className="h-4 w-4" />
                                            </NextUIButton>
                                        </Tooltip>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )}
        </CardBody>
      </Card>
    </div>

    {/* Add User Modal */}
    <Modal isOpen={isAddModalOpen} onOpenChange={onAddModalOpenChange} backdrop="blur" size="lg">
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1 text-primary">Add New Console User</ModalHeader>
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
                           Create a new user account in Firebase Authentication and a corresponding profile in the `consoleUsers` collection.
                        </p>
                        <div className="space-y-4 pt-2">
                             <NextUIInput
                                isRequired
                                label="Email"
                                placeholder="new.user@haqqman.com"
                                value={addForm.email}
                                onValueChange={(v) => setAddForm({ ...addForm, email: v.toLowerCase().trim() })}
                                variant="bordered"
                            />
                             <NextUIInput
                                isRequired
                                type="password"
                                label="Password"
                                placeholder="Set a temporary password"
                                value={addForm.password}
                                onValueChange={(v) => setAddForm({ ...addForm, password: v })}
                                variant="bordered"
                            />
                            <div className="flex gap-4">
                                <NextUIInput
                                    isRequired
                                    label="First Name"
                                    value={addForm.firstName}
                                    onValueChange={(v) => setAddForm({ ...addForm, firstName: v })}
                                    variant="bordered"
                                />
                                <NextUIInput
                                    isRequired
                                    label="Last Name"
                                    value={addForm.lastName}
                                    onValueChange={(v) => setAddForm({ ...addForm, lastName: v })}
                                    variant="bordered"
                                />
                            </div>
                            <NextUIInput
                                label="Phone Number"
                                value={addForm.phoneNumber}
                                onValueChange={(v) => setAddForm({ ...addForm, phoneNumber: v })}
                                variant="bordered"
                            />
                             <NextUISelect
                                isRequired
                                label="Role"
                                placeholder="Select a role"
                                selectedKeys={[addForm.role]}
                                onSelectionChange={(keys) => setAddForm({ ...addForm, role: Array.from(keys)[0] as User['role'] })}
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
                        <NextUIButton color="warning" onPress={handleCreateUser} isLoading={isSubmitting} disabled={isSubmitting} className="text-primary">
                            Create User
                        </NextUIButton>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
    </Modal>
    
    {/* Edit User Modal */}
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
                           <NextUIInput
                                label="First Name"
                                value={editForm.firstName}
                                onValueChange={(v) => setEditForm({ ...editForm, firstName: v })}
                                variant="bordered"
                            />
                            <NextUIInput
                                label="Last Name"
                                value={editForm.lastName}
                                onValueChange={(v) => setEditForm({ ...editForm, lastName: v })}
                                variant="bordered"
                            />
                            <NextUIInput
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
                                isDisabled={user?.id === editingUser?.id}
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

    {/* Delete User Modal */}
    <Modal isOpen={isDeleteModalOpen} onOpenChange={onDeleteModalOpenChange} backdrop="blur">
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1 text-primary">Delete Console User?</ModalHeader>
                    <ModalBody>
                        <p>Are you sure you want to delete the user <span className="font-semibold">{deletingUser?.name}</span> ({deletingUser?.email})?</p>
                        <p className="text-sm text-danger">This will remove their profile from the console database but will <span className="font-bold">NOT</span> delete their account from Firebase Authentication.</p>
                    </ModalBody>
                    <ModalFooter>
                        <NextUIButton variant="light" onPress={onClose} disabled={isSubmitting}>
                            Cancel
                        </NextUIButton>
                        <NextUIButton color="danger" onPress={handleDeleteUser} isLoading={isSubmitting} disabled={isSubmitting} className="text-white">
                            Delete User Profile
                        </NextUIButton>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
    </Modal>
    </>
  );
}
