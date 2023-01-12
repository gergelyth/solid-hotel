<div align="center"> <h1>Solid Hotel</h1> </div>

<div align="center"> <h3>Digital solutions in the hospitality area operating on the Solid framework</h3></div>

### What is Solid?

[Solid is a framework](https://solidproject.org/), devised by a group at MIT, led by Prof. Tim Berners-Lee, inventor of the World Wide Web.
Solid lets people store their data in a decentralized way. 
When data is stored in someone's storage unit, in a so called Pod, they control who and what applications can access it on a modular level.

The project provides a solution for the data ownership problem, decoupling content from the application and putting the users in control of managing access to their information.

### This repository

This monorepo contains some proof of concept implementations of applications used in the hospitality area operating on the Solid framework:
1. *Property management system* - handling the hotel's side of the expected operations, such as booking, check-in, check-out and guest support.
2. *Guest portal application* - handling the above mentioned operations on the side of the guest, providing an overview of their reservations and allowing them to communicate with the hotel.
3. *Solid profile editor* - granting the ability to manage the personal information of the guest by both sides.

Please see the `docs` for more information.

### Other

Note that some functionalities were not yet present in Inrupt's `solid-client` library at the time of writing this project (or were in the early alpha stage), such as [WebSocket notifications](https://docs.inrupt.com/developer-tools/javascript/client-libraries/tutorial/subscribe-to-notifications/) or the [universal access API](https://docs.inrupt.com/developer-tools/javascript/client-libraries/tutorial/manage-access-policies-universal/).
As such, for these problems we provide our own low level implementations.

Note that this project has accomplished its goal to provide a sketch of the potential implementations of these functionalities.
Therefore it is no longer maintained, updated or monitored.
