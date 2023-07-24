**NetRunner**

**Summary:**
NetRunner is a unique real-world exploration game set in a cyberpunk-inspired universe. Players venture into the real world, utilizing their GPS positions to conquer nodes representing real-world landmarks and locations. In this multiplayer online game, players establish territorial control by connecting conquered nodes, generating in-game currency, and strategically upgrading nodes to increase resistance against rival players. Engaging in real-time multiplayer interactions, players can enter each other's territories to absorb credits and strengthen their dominance in the futuristic cityscape.

**Used Technologies, Frameworks, and Libraries:**
- Frontend: React with Vite, Axios, Zustand, Mapbox
- Backend: Spring Boot with Spring WebFlux, MongoDB
- Testing: JUnit, AssertJ, Mockito, MockMvc, Flapdoodle (for integration tests)
- Deployment: GitHub Actions for CI/CD, Docker

**Game Mechanics:**
1. **Real-World Exploration:** NetRunner utilizes players' GPS positions to allow them to explore the real world, conquering nodes at specific real-world locations and landmarks.

2. **Territory Control:** Players establish territorial control by connecting conquered nodes, forming a network that generates in-game currency based on the player's real-world exploration.

3. **Resistance Upgrades:** Players can invest in node upgrades, boosting their resistance to attacks from other players. Upgraded nodes provide enhanced defense for the player's territory.

4. **Real-Time Multiplayer:** NetRunner offers real-time multiplayer interactions, enabling players to engage with each other's territories. Players can enter rival territories to absorb credits and strengthen their own holdings.

5. **User Authentication:** Players must register and log in to access the game's features. Spring Security ensures secure user authentication and management.

6. **Customizable Protagonist:** Players can personalize their in-game character, choosing the protagonist's gender, appearance, and background to create a unique identity in the cyberpunk universe.

**Current State of the Project:**
NetRunner is currently under development, with the frontend designed using React, Vite, and Mapbox to integrate the cyberpunk-themed interface with real-world map exploration based on players' GPS positions. The backend relies on Spring Boot, Spring WebFlux, and MongoDB to handle real-time multiplayer interactions, node data, and user profiles effectively. Comprehensive testing, utilizing JUnit, AssertJ, Mockito, and MockMvc, ensures stable and reliable gameplay.

The game mechanics focus on real-world exploration, territorial control, and resistance upgrades. Real-time multiplayer functionality is being developed, allowing players to interact with each other's territories and engage in credit absorption during territorial encounters.

The project's CI/CD pipeline, powered by GitHub Actions and Docker, facilitates automated testing and deployment to various environments, including Amazon, Heroku, and self-hosted servers.

As development continues, NetRunner aims to provide an immersive experience, enabling players to explore the real world through the lens of a cyberpunk universe, strategize their territorial control, and engage in thrilling multiplayer encounters within the futuristic cityscape.