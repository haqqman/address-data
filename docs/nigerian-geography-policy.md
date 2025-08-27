# Nigerian Geography Data Policy

This document outlines the policy and data structure for handling Nigerian geographical information (States, LGAs, Cities, and Districts) within the Address Data platform. This ensures consistency for data submission, API responses, and internal management.

## Standard Hierarchy

For the 36 states of Nigeria, the standard geographical hierarchy is as follows:

**State -> Local Government Area (LGA) -> City/Town**

-   **State**: The primary administrative division (e.g., Lagos, Kano, Rivers).
-   **LGA**: The second-level administrative division within a state (e.g., Ikeja LGA in Lagos).
-   **City/Town**: A populated place within an LGA (e.g., Ikeja city within Ikeja LGA).

In this structure, the concept of a "District" is not used.

## Federal Capital Territory (FCT) - Special Case

The Federal Capital Territory (FCT) has a unique administrative structure that is handled differently from other states.

The hierarchy for the FCT is:

**State (FCT) -> Local Government Area (LGA) -> District**

-   **State**: Federal Capital Territory (FCT).
-   **LGA**: An Area Council within the FCT (e.g., Abuja Municipal Area Council - AMAC, Kuje Area Council).
-   **District**: A specific, defined area within an FCT Area Council (e.g., Maitama, Gwarinpa, Wuse). These are analogous to "Cities/Towns" in other states for the purpose of our data structure.

### Why the Distinction?

While "Abuja" is the city and capital, the actual residential and business locations are designated by their district names. To ensure the highest level of accuracy and granularity for addresses within the FCT, we use **Districts** as the final location specifier instead of a generic "City" entry.

For example, a correct FCT address would be structured as:
-   **State**: FCT
-   **LGA**: Abuja Municipal Area Council (AMAC)
-   **District**: Garki

This is more precise than simply stating "Abuja".

## Impact on Data Submission and API Usage

-   **Address/Estate Submission Forms**: When "FCT" is selected as the state, the form will dynamically prompt the user to select an LGA (Area Council) and then a specific **District**. The "City" field will be automatically set to "Abuja" and disabled, as the district is the required level of detail.
-   **API Data**:
    -   When querying for sub-divisions of an LGA in a standard state, the API will return a list of `cities`.
    -   When querying for sub-divisions of an LGA in FCT, the API endpoint remains the same (e.g., `/api/states/fct/lga/amac/cities`), but the data returned will be a list of **districts**. This ensures a consistent API endpoint structure while providing the correct type of geographical data.
