
"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Card as NextUICard, 
  CardHeader as NextUICardHeader, 
  CardBody as NextUICardBody, 
  Button as NextUIButton, 
  Tabs, 
  Tab,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input as NextUIInput,
  Select as NextUISelect,
  SelectItem as NextUISelectItem,
  useDisclosure,
  Spinner
} from "@nextui-org/react";
import { PlusCircle, Edit3, Trash2, MapPin, Building, Map } from "lucide-react";
import { 
  addState, getStates, updateState, deleteState,
  addLga, getLgasForState, updateLga, deleteLga,
  addCity, getCitiesForLga, updateCity, deleteCity
} from "@/app/actions/geographyActions";
import type { GeographyState, GeographyLGA, GeographyCity } from "@/types";

type GeoEntityType = "State" | "LGA" | "City";
interface EditableGeoEntity {
  id: string;
  name: string;
  capital?: string; // For State
  parentId?: string; // For LGA (StateId), For City (LGAId)
  grandParentId?: string; // For City (StateId)
  type: GeoEntityType;
}

export default function GeographyManagementPage() {
  const [states, setStates] = useState<GeographyState[]>([]);
  const [lgas, setLgas] = useState<GeographyLGA[]>([]);
  const [cities, setCities] = useState<GeographyCity[]>([]);
  
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingLgas, setIsLoadingLgas] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  const [selectedStateIdForLgas, setSelectedStateIdForLgas] = useState<string | null>(null);
  const [selectedStateIdForCities, setSelectedStateIdForCities] = useState<string | null>(null);
  const [selectedLgaIdForCities, setSelectedLgaIdForCities] = useState<string | null>(null);

  const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: onAddModalClose, onOpenChange: onAddModalOpenChange } = useDisclosure();
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose, onOpenChange: onEditModalOpenChange } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose, onOpenChange: onDeleteModalOpenChange } = useDisclosure();

  const [entityTypeToAdd, setEntityTypeToAdd] = useState<GeoEntityType>("State");
  const [newStateName, setNewStateName] = useState("");
  const [newStateCapital, setNewStateCapital] = useState("");
  const [newLgaName, setNewLgaName] = useState("");
  const [selectedStateForNewLga, setSelectedStateForNewLga] = useState<string>("");
  const [newCityName, setNewCityName] = useState("");
  const [selectedStateForNewCity, setSelectedStateForNewCity] = useState<string>("");
  const [selectedLgaForNewCity, setSelectedLgaForNewCity] = useState<string>("");
  const [lgasForCityDropdown, setLgasForCityDropdown] = useState<GeographyLGA[]>([]);


  const [editingEntity, setEditingEntity] = useState<EditableGeoEntity | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedCapital, setEditedCapital] = useState("");
  
  const [deletingEntity, setDeletingEntity] = useState<EditableGeoEntity | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStates = useCallback(async () => {
    setIsLoadingStates(true);
    const fetchedStates = await getStates();
    setStates(fetchedStates);
    setIsLoadingStates(false);
  }, []);

  const fetchLgas = useCallback(async (stateId: string) => {
    if (!stateId) {
      setLgas([]);
      return;
    }
    setIsLoadingLgas(true);
    const fetchedLgas = await getLgasForState(stateId);
    setLgas(fetchedLgas);
    setIsLoadingLgas(false);
  }, []);
  
  const fetchCities = useCallback(async (stateId: string, lgaId: string) => {
    if (!stateId || !lgaId) {
      setCities([]);
      return;
    }
    setIsLoadingCities(true);
    const fetchedCities = await getCitiesForLga(stateId, lgaId);
    setCities(fetchedCities);
    setIsLoadingCities(false);
  }, []);

  useEffect(() => {
    fetchStates();
  }, [fetchStates]);

  useEffect(() => {
    if (selectedStateIdForLgas) {
      fetchLgas(selectedStateIdForLgas);
    } else {
      setLgas([]);
    }
  }, [selectedStateIdForLgas, fetchLgas]);

  useEffect(() => {
    if (selectedStateIdForCities && selectedLgaIdForCities) {
      fetchCities(selectedStateIdForCities, selectedLgaIdForCities);
    } else {
      setCities([]);
    }
  }, [selectedStateIdForCities, selectedLgaIdForCities, fetchCities]);

  useEffect(() => {
    if (entityTypeToAdd === "City" && selectedStateForNewCity) {
      const fetchLgasForDropdown = async () => {
        const fetchedLgas = await getLgasForState(selectedStateForNewCity);
        setLgasForCityDropdown(fetchedLgas);
      };
      fetchLgasForDropdown();
    } else {
      setLgasForCityDropdown([]);
    }
  }, [entityTypeToAdd, selectedStateForNewCity]);


  const handleAddEntity = async () => {
    setIsSubmitting(true);
    try {
      if (entityTypeToAdd === "State") {
        if (!newStateName.trim() || !newStateCapital.trim()) {
          alert("State name and capital are required.");
          setIsSubmitting(false);
          return;
        }
        await addState({ name: newStateName, capital: newStateCapital });
        setNewStateName("");
        setNewStateCapital("");
        fetchStates();
      } else if (entityTypeToAdd === "LGA") {
        if (!newLgaName.trim() || !selectedStateForNewLga) {
          alert("LGA name and parent state are required.");
          setIsSubmitting(false);
          return;
        }
        await addLga(selectedStateForNewLga, { name: newLgaName });
        setNewLgaName("");
        setSelectedStateForNewLga("");
        if(selectedStateIdForLgas === selectedStateForNewLga) fetchLgas(selectedStateForNewLga);
      } else if (entityTypeToAdd === "City") {
         if (!newCityName.trim() || !selectedStateForNewCity || !selectedLgaForNewCity) {
          alert("City name, parent state, and parent LGA are required.");
          setIsSubmitting(false);
          return;
        }
        await addCity(selectedStateForNewCity, selectedLgaForNewCity, { name: newCityName });
        setNewCityName("");
        setSelectedStateForNewCity("");
        setSelectedLgaForNewCity("");
        if(selectedStateIdForCities === selectedStateForNewCity && selectedLgaIdForCities === selectedLgaForNewCity) fetchCities(selectedStateForNewCity, selectedLgaForNewCity);
      }
      onAddModalClose();
    } catch (error) {
      console.error("Error adding entity:", error);
      alert(`Failed to add ${entityTypeToAdd}.`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const openEditModal = (entity: GeographyState | GeographyLGA | GeographyCity, type: GeoEntityType) => {
    let parentId, grandParentId;
    if (type === "LGA") {
        parentId = (entity as GeographyLGA).stateId;
    } else if (type === "City") {
        grandParentId = (entity as GeographyCity).stateId;
        parentId = (entity as GeographyCity).lgaId;
    }

    setEditingEntity({
      id: entity.id,
      name: entity.name,
      capital: type === "State" ? (entity as GeographyState).capital : undefined,
      type: type,
      parentId: parentId,
      grandParentId: grandParentId
    });
    setEditedName(entity.name);
    if (type === "State") setEditedCapital((entity as GeographyState).capital || "");
    onEditModalOpen();
  };

  const handleEditEntity = async () => {
    if (!editingEntity) return;
    setIsSubmitting(true);
    try {
      if (editingEntity.type === "State") {
        await updateState(editingEntity.id, { name: editedName, capital: editedCapital });
        fetchStates();
      } else if (editingEntity.type === "LGA" && editingEntity.parentId) {
        await updateLga(editingEntity.parentId, editingEntity.id, { name: editedName });
        if(selectedStateIdForLgas === editingEntity.parentId) fetchLgas(editingEntity.parentId);
      } else if (editingEntity.type === "City" && editingEntity.grandParentId && editingEntity.parentId) {
        await updateCity(editingEntity.grandParentId, editingEntity.parentId, editingEntity.id, { name: editedName });
        if(selectedStateIdForCities === editingEntity.grandParentId && selectedLgaIdForCities === editingEntity.parentId) fetchCities(editingEntity.grandParentId, editingEntity.parentId);
      }
      onEditModalClose();
    } catch (error) {
      console.error("Error updating entity:", error);
      alert(`Failed to update ${editingEntity.type}.`);
    } finally {
      setIsSubmitting(false);
      setEditingEntity(null);
    }
  };

  const openDeleteModal = (entity: GeographyState | GeographyLGA | GeographyCity, type: GeoEntityType) => {
    let parentId, grandParentId;
    if (type === "LGA") {
        parentId = (entity as GeographyLGA).stateId;
    } else if (type === "City") {
        grandParentId = (entity as GeographyCity).stateId;
        parentId = (entity as GeographyCity).lgaId;
    }
    setDeletingEntity({
      id: entity.id,
      name: entity.name,
      type: type,
      parentId: parentId,
      grandParentId: grandParentId
    });
    onDeleteModalOpen();
  };

  const handleDeleteEntity = async () => {
    if (!deletingEntity) return;
    setIsSubmitting(true);
    try {
      if (deletingEntity.type === "State") {
        await deleteState(deletingEntity.id);
        fetchStates();
        if (selectedStateIdForLgas === deletingEntity.id) setSelectedStateIdForLgas(null);
        if (selectedStateIdForCities === deletingEntity.id) setSelectedStateIdForCities(null);
      } else if (deletingEntity.type === "LGA" && deletingEntity.parentId) {
        await deleteLga(deletingEntity.parentId, deletingEntity.id);
        if(selectedStateIdForLgas === deletingEntity.parentId) fetchLgas(deletingEntity.parentId);
        if (selectedLgaIdForCities === deletingEntity.id) setSelectedLgaIdForCities(null);
      } else if (deletingEntity.type === "City" && deletingEntity.grandParentId && deletingEntity.parentId) {
        await deleteCity(deletingEntity.grandParentId, deletingEntity.parentId, deletingEntity.id);
         if(selectedStateIdForCities === deletingEntity.grandParentId && selectedLgaIdForCities === deletingEntity.parentId) fetchCities(deletingEntity.grandParentId, deletingEntity.parentId);
      }
      onDeleteModalClose();
    } catch (error) {
      console.error("Error deleting entity:", error);
      alert(`Failed to delete ${deletingEntity.type}. It might have child elements (LGAs or Cities) that need to be removed first.`);
    } finally {
      setIsSubmitting(false);
      setDeletingEntity(null);
    }
  };
  
  const renderLoading = () => <div className="flex justify-center items-center p-8"><Spinner color="secondary"/></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex flex-col space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Geography Management</h1>
          <p className="text-foreground-500">
            Manage states, Local Government Areas (LGAs), and cities.
          </p>
        </div>
        <NextUIButton 
            color="warning" 
            onPress={onAddModalOpen}
            className="text-primary shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0.5 transition-transform duration-150 ease-in-out" 
            startContent={<PlusCircle className="h-4 w-4" />}
        >
             Add Geography Data
        </NextUIButton>
      </div>

      <Tabs aria-label="Geography Management Tabs" color="secondary" variant="bordered">
        <Tab key="states" title={<span className="flex items-center"><Map className="mr-2 h-5 w-5 text-secondary" />States</span>}>
          <NextUICard className="shadow-xl rounded-xl bg-background">
            <NextUICardHeader className="px-6 pt-6 pb-2 flex justify-between items-center">
              <div className="flex flex-col space-y-0.5">
                <h2 className="text-xl font-semibold text-primary">Manage States</h2>
                <p className="text-sm text-foreground-500">Add, edit, or remove states.</p>
              </div>
            </NextUICardHeader>
            <NextUICardBody className="p-2 md:p-4">
              {isLoadingStates ? renderLoading() : (
                states.length === 0 ? <p className="text-foreground-500">No states found. Add one to get started.</p> :
                <ul className="space-y-2">
                  {states.map(state => (
                    <li key={state.id} className="p-3 border rounded-lg flex justify-between items-center hover:bg-default-100">
                      <div>
                          <p className="font-medium text-primary">{state.name} (Capital: {state.capital})</p>
                          <p className="text-xs text-foreground-400">ID: {state.id}</p>
                      </div>
                      <div className="space-x-1">
                          <NextUIButton isIconOnly size="sm" variant="light" color="secondary" aria-label="Edit State" onPress={() => openEditModal(state, "State")}><Edit3 className="h-4 w-4"/></NextUIButton>
                          <NextUIButton isIconOnly size="sm" variant="light" color="danger" aria-label="Delete State" onPress={() => openDeleteModal(state, "State")}><Trash2 className="h-4 w-4"/></NextUIButton>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </NextUICardBody>
          </NextUICard>
        </Tab>

        <Tab key="lgas" title={<span className="flex items-center"><Building className="mr-2 h-5 w-5 text-secondary" />LGAs</span>}>
          <NextUICard className="shadow-xl rounded-xl bg-background">
            <NextUICardHeader className="px-6 pt-6 pb-2">
              <div className="flex justify-between items-center w-full mb-4">
                <div className="flex flex-col space-y-0.5">
                  <h2 className="text-xl font-semibold text-primary">Manage LGAs</h2>
                  <p className="text-sm text-foreground-500">Select a state to view and manage its LGAs.</p>
                </div>
                <NextUISelect
                  label="Select State"
                  placeholder="Choose a state"
                  selectedKeys={selectedStateIdForLgas ? [selectedStateIdForLgas] : []}
                  onSelectionChange={(keys) => setSelectedStateIdForLgas(Array.from(keys)[0] as string)}
                  className="max-w-xs"
                  variant="bordered"
                  color="secondary"
                >
                  {states.map((state) => (
                    <NextUISelectItem key={state.id} value={state.id} textValue={state.name}>
                      {state.name}
                    </NextUISelectItem>
                  ))}
                </NextUISelect>
              </div>
            </NextUICardHeader>
            <NextUICardBody className="p-2 md:p-4">
              {isLoadingLgas ? renderLoading() : !selectedStateIdForLgas ? <p className="text-foreground-500">Please select a state.</p> :
                lgas.length === 0 && selectedStateIdForLgas ? <p className="text-foreground-500">No LGAs found for the selected state.</p> :
                <ul className="space-y-2">
                  {lgas.map(lga => (
                    <li key={lga.id} className="p-3 border rounded-lg flex justify-between items-center hover:bg-default-100">
                      <div>
                          <p className="font-medium text-primary">{lga.name}</p>
                          <p className="text-xs text-foreground-400">ID: {lga.id}</p>
                      </div>
                      <div className="space-x-1">
                          <NextUIButton isIconOnly size="sm" variant="light" color="secondary" aria-label="Edit LGA" onPress={() => openEditModal(lga, "LGA")}><Edit3 className="h-4 w-4"/></NextUIButton>
                          <NextUIButton isIconOnly size="sm" variant="light" color="danger" aria-label="Delete LGA" onPress={() => openDeleteModal(lga, "LGA")}><Trash2 className="h-4 w-4"/></NextUIButton>
                      </div>
                    </li>
                  ))}
                </ul>
              }
            </NextUICardBody>
          </NextUICard>
        </Tab>

        <Tab key="cities" title={<span className="flex items-center"><MapPin className="mr-2 h-5 w-5 text-secondary" />Cities/Towns</span>}>
          <NextUICard className="shadow-xl rounded-xl bg-background">
            <NextUICardHeader className="px-6 pt-6 pb-2">
              <div className="flex justify-between items-start w-full mb-4"> {/* Changed items-center to items-start */}
                <div className="flex flex-col space-y-0.5">
                  <h2 className="text-xl font-semibold text-primary">Manage Cities/Towns</h2>
                  <p className="text-sm text-foreground-500">Select a state and LGA to manage cities/towns.</p>
                </div>
                <div className="flex gap-4">
                  <NextUISelect
                    label="Select State"
                    placeholder="Choose a state"
                    selectedKeys={selectedStateIdForCities ? [selectedStateIdForCities] : []}
                    onSelectionChange={(keys) => {
                      const stateId = Array.from(keys)[0] as string;
                      setSelectedStateIdForCities(stateId);
                      setSelectedLgaIdForCities(null); 
                      fetchLgas(stateId); 
                    }}
                    className="max-w-xs"
                    variant="bordered"
                    color="secondary"
                  >
                    {states.map((state) => (
                      <NextUISelectItem key={state.id} value={state.id} textValue={state.name}>
                        {state.name}
                      </NextUISelectItem>
                    ))}
                  </NextUISelect>
                  <NextUISelect
                    label="Select LGA"
                    placeholder="Choose an LGA"
                    selectedKeys={selectedLgaIdForCities ? [selectedLgaIdForCities] : []}
                    onSelectionChange={(keys) => setSelectedLgaIdForCities(Array.from(keys)[0] as string)}
                    className="max-w-xs"
                    isDisabled={!selectedStateIdForCities || lgas.length === 0}
                    variant="bordered"
                    color="secondary"
                  >
                    {lgas
                      .filter(lga => lga.stateId === selectedStateIdForCities) 
                      .map((lga) => (
                        <NextUISelectItem key={lga.id} value={lga.id} textValue={lga.name}>
                          {lga.name}
                        </NextUISelectItem>
                    ))}
                  </NextUISelect>
                </div>
              </div>
            </NextUICardHeader>
            <NextUICardBody className="p-2 md:p-4">
              {isLoadingCities ? renderLoading() : !selectedLgaIdForCities ? <p className="text-foreground-500">Please select a state and LGA.</p> :
                cities.length === 0 && selectedLgaIdForCities ? <p className="text-foreground-500">No cities/towns found for the selected LGA.</p> :
                <ul className="space-y-2">
                  {cities.map(city => (
                    <li key={city.id} className="p-3 border rounded-lg flex justify-between items-center hover:bg-default-100">
                       <div>
                          <p className="font-medium text-primary">{city.name}</p>
                           <p className="text-xs text-foreground-400">ID: {city.id}</p>
                      </div>
                      <div className="space-x-1">
                          <NextUIButton isIconOnly size="sm" variant="light" color="secondary" aria-label="Edit City" onPress={() => openEditModal(city, "City")}><Edit3 className="h-4 w-4"/></NextUIButton>
                          <NextUIButton isIconOnly size="sm" variant="light" color="danger" aria-label="Delete City" onPress={() => openDeleteModal(city, "City")}><Trash2 className="h-4 w-4"/></NextUIButton>
                      </div>
                    </li>
                  ))}
                </ul>
              }
            </NextUICardBody>
          </NextUICard>
        </Tab>
      </Tabs>
      
      <Modal isOpen={isAddModalOpen} onOpenChange={onAddModalOpenChange} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-primary">Add Geography Data</ModalHeader>
              <ModalBody>
                <NextUISelect
                  label="Select Entity Type"
                  selectedKeys={[entityTypeToAdd]}
                  onSelectionChange={(keys) => setEntityTypeToAdd(Array.from(keys)[0] as GeoEntityType)}
                  variant="bordered"
                  color="secondary"
                >
                  <NextUISelectItem key="State" value="State">State</NextUISelectItem>
                  <NextUISelectItem key="LGA" value="LGA">LGA</NextUISelectItem>
                  <NextUISelectItem key="City" value="City">City/Town</NextUISelectItem>
                </NextUISelect>

                {entityTypeToAdd === "State" && (
                  <>
                    <NextUIInput label="State Name" placeholder="Enter state name" value={newStateName} onValueChange={setNewStateName} variant="bordered" />
                    <NextUIInput label="State Capital" placeholder="Enter capital city" value={newStateCapital} onValueChange={setNewStateCapital} variant="bordered" />
                  </>
                )}
                {entityTypeToAdd === "LGA" && (
                  <>
                    <NextUISelect
                        label="Parent State"
                        placeholder="Select a state"
                        selectedKeys={selectedStateForNewLga ? [selectedStateForNewLga] : []}
                        onSelectionChange={(keys) => setSelectedStateForNewLga(Array.from(keys)[0] as string)}
                        variant="bordered"
                        color="secondary"
                    >
                        {states.map(s => <NextUISelectItem key={s.id} value={s.id} textValue={s.name}>{s.name}</NextUISelectItem>)}
                    </NextUISelect>
                    <NextUIInput label="LGA Name" placeholder="Enter LGA name" value={newLgaName} onValueChange={setNewLgaName} variant="bordered" />
                  </>
                )}
                {entityTypeToAdd === "City" && (
                  <>
                     <NextUISelect
                        label="Parent State"
                        placeholder="Select a state"
                        selectedKeys={selectedStateForNewCity ? [selectedStateForNewCity] : []}
                        onSelectionChange={(keys) => {
                            const stateId = Array.from(keys)[0] as string;
                            setSelectedStateForNewCity(stateId);
                            setSelectedLgaForNewCity(""); 
                        }}
                        variant="bordered"
                        color="secondary"
                    >
                        {states.map(s => <NextUISelectItem key={s.id} value={s.id} textValue={s.name}>{s.name}</NextUISelectItem>)}
                    </NextUISelect>
                    <NextUISelect
                        label="Parent LGA"
                        placeholder="Select an LGA"
                        selectedKeys={selectedLgaForNewCity ? [selectedLgaForNewCity] : []}
                        onSelectionChange={(keys) => setSelectedLgaForNewCity(Array.from(keys)[0] as string)}
                        isDisabled={!selectedStateForNewCity || lgasForCityDropdown.length === 0}
                        variant="bordered"
                        color="secondary"
                    >
                        {lgasForCityDropdown.map(lga => <NextUISelectItem key={lga.id} value={lga.id} textValue={lga.name}>{lga.name}</NextUISelectItem>)}
                    </NextUISelect>
                    <NextUIInput label="City/Town Name" placeholder="Enter city/town name" value={newCityName} onValueChange={setNewCityName} variant="bordered" />
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <NextUIButton variant="light" onPress={onClose} disabled={isSubmitting}>Cancel</NextUIButton>
                <NextUIButton color="warning" onPress={handleAddEntity} isLoading={isSubmitting} disabled={isSubmitting} className="text-primary">
                  Add {entityTypeToAdd}
                </NextUIButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditModalOpen} onOpenChange={onEditModalOpenChange} backdrop="blur">
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1 text-primary">Edit {editingEntity?.type}</ModalHeader>
                    <ModalBody>
                        <NextUIInput 
                            label="Name" 
                            value={editedName} 
                            onValueChange={setEditedName} 
                            variant="bordered" 
                        />
                        {editingEntity?.type === "State" && (
                            <NextUIInput 
                                label="Capital" 
                                value={editedCapital} 
                                onValueChange={setEditedCapital} 
                                variant="bordered"
                            />
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <NextUIButton variant="light" onPress={onClose} disabled={isSubmitting}>Cancel</NextUIButton>
                        <NextUIButton color="warning" onPress={handleEditEntity} isLoading={isSubmitting} disabled={isSubmitting} className="text-primary">
                            Save Changes
                        </NextUIButton>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
      </Modal>

       <Modal isOpen={isDeleteModalOpen} onOpenChange={onDeleteModalOpenChange} backdrop="blur">
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1 text-primary">Delete {deletingEntity?.type}?</ModalHeader>
                    <ModalBody>
                        <p>Are you sure you want to delete <span className="font-semibold">{deletingEntity?.name}</span>?</p>
                        <p className="text-sm text-danger">This action cannot be undone. If this {deletingEntity?.type} has child elements (e.g., a State has LGAs), they might also be affected or prevent deletion.</p>
                    </ModalBody>
                    <ModalFooter>
                        <NextUIButton variant="light" onPress={onClose} disabled={isSubmitting}>Cancel</NextUIButton>
                        <NextUIButton color="danger" onPress={handleDeleteEntity} isLoading={isSubmitting} disabled={isSubmitting} className="text-white">
                            Delete
                        </NextUIButton>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
      </Modal>

    </div>
  );
}
