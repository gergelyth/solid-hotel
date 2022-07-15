<div align="center"> <h1>User documentation</h1> </div>

**TODO** add the screenshots after finalizing outlook

This document serves as a general instruction manual for the user. Let's take a look at the major hotel operations executed in our applications from their point of view to see the apps work.

<div align="center"> <h2><ins>Guest Portal Application</ins></h2> </div>

First, we will take a look at the application aimed at the guests.

### <ins>Overview</ins>

Let's take a look at the index page first to familiarize ourselves with the ubiquitous components. 

We find the notification icon on the left of the navigation bar - this component displays the number of notifications the GPA currently recognizes. Clicking on the icon brings up the list of such items on the left side of the screen. These notification items are clickable and they may perform actions based on the type of the notification. This action is indicated by the notification message. The type, as well as the time the item the item was constructed, is displayed for each item. They are also deletable by clicking on the `Clear` button of the respective notification. Clicking anywhere else on the screen closes the displayed list.

The authentication button is placed on the right side of the navigation bar. The button performs the login or logout operation based on the current status of the user's authentication status. More on this functionality in [the Login section](#login).

> screenshot of GPA index

The body of the page contains the buttons allowing the user to operate with the hotel reservations and their profile. We'll take a look at each of these operations later in this section.

The buttom of the page consists of the application footer, which displays some basic information about the project. This component is not interactive.

### <ins>Login in GPA</ins>

Detailed in [the shared functionalities reference section](#login).

### <ins>Booking</ins>

Clicking on the `Book a room` button on the index page begins the process of making a reservation. This operation is separated into three sequential subpages.

The first stop is to select the room for which the reservation will be made. The user can only select one room at a time. Below these options are the date picker elements, which let the user select their check-in and check-out dates. Note that the earliest date that can be chosen for the check-in date is the current day, while the earliest for check-out is the day after the check-in date. If the components report an error, please select dates which these specifications. When the user is satisfied with their choices, they click the `Proceed` button.

> screenshot of the room selection screen in booking

The second subpage is one which checks if all the personal information fields required for future check-in are present in the guest's profile saved in the Pod (we specify here and for future reference that this profile is saved under `{USER_POD}/profile/card#me`). If some field is missing, the application provides a way to fill it in. The `Proceed` button gets enabled when all fields have corresponding values.

The third subpage is the one informing the user about the successful operation. At this point we saved a reservation object with the details into the guest's Solid Pod. This reservation will temporarily be in the `REQUESTED` state - when the hotel responds and confirms the reservation, it gets changed to `CONFIRMED` and the booking is completed.

### <ins>List reservation and reservation detail</ins>



<div align="center"> <h2><ins>Property Management System</ins></h2> </div>


<div align="center"> <h2><ins>Solid Profile Editor</ins></h2> </div>

<div align="center"> <h2><ins>Shared functionalities reference</ins></h2> </div>

We detail the operations here which are common for two or more applications.

### <ins>Login</ins>

As the first operation, the user must log in to their Solid Pod, as only a very few functionalities are permitted while being unauthenticated. To achieve this, click on the Login button found in the navigation bar.

This takes the user to the login page, where they have the option to input a custom Solid provider, or choose from the built-in ones. These Solid providers are the places the user's Pod is located. The input field for custom providers verifies the text entered, so make sure to input a valid URL link.

> screenshot of login page

After selecting a provider, the GPA redirects to the provider's page to authenticate the user. Please input your login details here. If the operation is successful, the user is returned to either the login or the index page.