Create a React Native application that has two screens and two drawer menus.
The default screen should be showing google maps.

Map screen
On the map there should be pins on different locations. The data for the pins should be fetched from a local server. You can download the server implementation from here.
Start the server by running npm install && node server.js


Every pin should be tappable, and when tapped on, a pop up window should be shown to the user ( could be a bottom sheet drawer, or some other component ) with detailed information about the pin.

The information for the pin consists of the following:
Title ( of the location )
Latitude -> a decimal number
Longitude -> a decimal number
Connectors -> an array of connector objects
Connector object: 
type -> an enum with the following possible values: ‘J1772’, ‘Type2’, ‘CCS 2’, ‘Type 3’
Status -> an enum with the following possible values: ‘available’, ‘unavailable’ - a different color should be used as a text color when showing the status
An important requirement is to render only the pins whose coordinates fall inside the currently visible boundaries of the map.
Settings screen
This screen should give the user the option to choose a pin style, the chosen style will change the look of the pins on the map. This user preference for a pin style should be saved so that after a new start of the application the previously chosen style is applied.

Left drawer menu
This drawer menu should be displayed from the left side. To do so, add a button on the top left of the map screen(hamburger icon could be used).
It should contain one menu item with a title “Settings” and navigate to the Settings screen.
Right drawer menu
To display this menu, add a button on the top right side of the map screen. It should be displayed from the right side.
This menu should display two filter sections: 
Checkboxes for each connector type
Checkboxes for each connector status
Finally, display below the filters an “Apply” button. After the user taps on “Apply”, filter the pins on the map and close the filter drawer menu.

Optional / Nice to have
Add support for offline mode, which consists of three business rules:
Show an alert on the map, on the top side, showing the user that the connection is lost and the information may be outdated
Showing the last fetched pins from the server until the connection is restored
Refetch the pins again when the connection is restored

What’s expected
Use Redux Toolkit for state management
Use strong types -> Typescript is a must
Organization of the code
Storing the pins in a global store
Write unit/integration tests
