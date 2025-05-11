
"use client";

import { Card as NextUICard, CardHeader as NextUICardHeader, CardBody as NextUICardBody, Button as NextUIButton, Tabs, Tab } from "@nextui-org/react";
import { PlusCircle, Edit3, Trash2 } from "lucide-react";

// Mock data for demonstration - replace with actual data fetching and state management
const mockStates = [
  { id: "1", name: "Lagos", capital: "Ikeja", lgaCount: 20 },
  { id: "2", name: "Abuja FCT", capital: "Abuja", lgaCount: 6 },
  { id: "3", name: "Rivers", capital: "Port Harcourt", lgaCount: 23 },
];

const mockLgas = [
  { id: "lga1", name: "Ikeja", state: "Lagos", cityCount: 5 },
  { id: "lga2", name: "AMAC", state: "Abuja FCT", cityCount: 10 },
];

const mockCities = [
  { id: "city1", name: "Ikeja", lga: "Ikeja", state: "Lagos" },
  { id: "city2", name: "Wuse", lga: "AMAC", state: "Abuja FCT" },
];


export default function GeographyManagementPage() {
  // In a real app, you'd use useState, useEffect to fetch and manage this data
  // from Firestore, and functions to handle create, update, delete operations.

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex flex-col space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Geography Management</h1>
          <p className="text-foreground-500">
            Manage states, Local Government Areas (LGAs), and cities.
          </p>
        </div>
        <NextUIButton 
            color="warning" 
            // onPress={onOpenAddModal} // Placeholder for opening a modal to add new geo data
            className="text-white shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0.5 transition-transform duration-150 ease-in-out" 
            startContent={<PlusCircle className="h-4 w-4" />}
        >
             Add New Geography Data
        </NextUIButton>
      </div>

      <Tabs aria-label="Geography Management Tabs" color="primary" variant="bordered">
        <Tab key="states" title="States">
          <NextUICard className="shadow-xl rounded-xl">
            <NextUICardHeader className="px-6 pt-6 pb-2 flex justify-between items-center">
              <div className="flex flex-col space-y-0.5">
                <h2 className="text-xl font-semibold">Manage States</h2>
                <p className="text-sm text-foreground-500">Add, edit, or remove states.</p>
              </div>
              {/* <NextUIButton size="sm" color="primary" variant="flat" startContent={<PlusCircle className="h-4 w-4" />}>Add State</NextUIButton> */}
            </NextUICardHeader>
            <NextUICardBody className="p-2 md:p-4">
              {/* Placeholder content - In a real app, this would be a table or list of states */}
              <ul className="space-y-2">
                {mockStates.map(state => (
                  <li key={state.id} className="p-3 border rounded-lg flex justify-between items-center hover:bg-default-100">
                    <div>
                        <p className="font-medium">{state.name} (Capital: {state.capital})</p>
                        <p className="text-sm text-foreground-500">{state.lgaCount} LGAs</p>
                    </div>
                    <div className="space-x-1">
                        <NextUIButton isIconOnly size="sm" variant="light" color="primary" aria-label="Edit State"><Edit3 className="h-4 w-4"/></NextUIButton>
                        <NextUIButton isIconOnly size="sm" variant="light" color="danger" aria-label="Delete State"><Trash2 className="h-4 w-4"/></NextUIButton>
                    </div>
                  </li>
                ))}
              </ul>
               {mockStates.length === 0 && <p className="text-foreground-500">No states found. Add one to get started.</p>}
            </NextUICardBody>
          </NextUICard>
        </Tab>

        <Tab key="lgas" title="LGAs">
          <NextUICard className="shadow-xl rounded-xl">
            <NextUICardHeader className="px-6 pt-6 pb-2 flex justify-between items-center">
              <div className="flex flex-col space-y-0.5">
                <h2 className="text-xl font-semibold">Manage LGAs</h2>
                <p className="text-sm text-foreground-500">Add, edit, or remove Local Government Areas.</p>
              </div>
               {/* <NextUIButton size="sm" color="primary" variant="flat" startContent={<PlusCircle className="h-4 w-4" />}>Add LGA</NextUIButton> */}
            </NextUICardHeader>
            <NextUICardBody className="p-2 md:p-4">
              {/* Placeholder content */}
              <ul className="space-y-2">
                {mockLgas.map(lga => (
                  <li key={lga.id} className="p-3 border rounded-lg flex justify-between items-center hover:bg-default-100">
                    <div>
                        <p className="font-medium">{lga.name} (State: {lga.state})</p>
                        <p className="text-sm text-foreground-500">{lga.cityCount} Cities/Towns</p>
                    </div>
                     <div className="space-x-1">
                        <NextUIButton isIconOnly size="sm" variant="light" color="primary" aria-label="Edit LGA"><Edit3 className="h-4 w-4"/></NextUIButton>
                        <NextUIButton isIconOnly size="sm" variant="light" color="danger" aria-label="Delete LGA"><Trash2 className="h-4 w-4"/></NextUIButton>
                    </div>
                  </li>
                ))}
              </ul>
              {mockLgas.length === 0 && <p className="text-foreground-500">No LGAs found.</p>}
            </NextUICardBody>
          </NextUICard>
        </Tab>

        <Tab key="cities" title="Cities/Towns">
          <NextUICard className="shadow-xl rounded-xl">
            <NextUICardHeader className="px-6 pt-6 pb-2 flex justify-between items-center">
              <div className="flex flex-col space-y-0.5">
                <h2 className="text-xl font-semibold">Manage Cities/Towns</h2>
                <p className="text-sm text-foreground-500">Add, edit, or remove cities or towns within LGAs.</p>
              </div>
               {/* <NextUIButton size="sm" color="primary" variant="flat" startContent={<PlusCircle className="h-4 w-4" />}>Add City</NextUIButton> */}
            </NextUICardHeader>
            <NextUICardBody className="p-2 md:p-4">
              {/* Placeholder content */}
              <ul className="space-y-2">
                {mockCities.map(city => (
                  <li key={city.id} className="p-3 border rounded-lg flex justify-between items-center hover:bg-default-100">
                    <div>
                        <p className="font-medium">{city.name} (LGA: {city.lga}, State: {city.state})</p>
                    </div>
                    <div className="space-x-1">
                        <NextUIButton isIconOnly size="sm" variant="light" color="primary" aria-label="Edit City"><Edit3 className="h-4 w-4"/></NextUIButton>
                        <NextUIButton isIconOnly size="sm" variant="light" color="danger" aria-label="Delete City"><Trash2 className="h-4 w-4"/></NextUIButton>
                    </div>
                  </li>
                ))}
              </ul>
              {mockCities.length === 0 && <p className="text-foreground-500">No cities/towns found.</p>}
            </NextUICardBody>
          </NextUICard>
        </Tab>
      </Tabs>
      
      {/* Add Modals for Create/Edit/Delete operations here */}
      {/* Example: 
        <Modal isOpen={isAddModalOpen} onOpenChange={onAddModalOpenChange}>
            <ModalContent>...</ModalContent>
        </Modal>
      */}

    </div>
  );
}
