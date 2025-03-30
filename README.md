# ddd-weather-vue3

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

---

# Project goal

The goal of the project is to implement a simple weather dashboard, using a public API like https://open-meteo.com/en/docs to show historical and forecasted weather data for a specific location using vue 3 and typescript.
Furthermore, the idea is to expose clean code and DDD (design drive development) while doing consistent commits for git structure.
Lastly, keeping an eye on semantic, accessible and performant code.

## DDD (Domain driven development)

In DDD we try to make the project structure closer to business terminology by using Ubiquitous language. This means, having terminology that closely resembles the business needs and hence making it easier to navigate the project according by understanding the business.
This also implies some consideration prior to starting building the project, the same way an architect designs the house before we build it.

For the project structure however, we can consider 3 main areas:

1. Domain (Core business logic)
2. Application (Handles use cases and interacts with the domain)
3. Infrastructure (External dependencies like APIs, databases, or HTTP clients)

For the intended exercise, we can consider a structure similar to the following:

### Directory Structure

- **src**

  - **domain**
    - **entities**
      - `Weather.ts`
      - `Location.ts`
  - **application**
    - **services**
      - `WeatherService.ts`
  - **infrastructure**
    - **repositories**
      - `WeatherApiRepository.ts`
    - **api**
      - `OpenMeteoClient.ts`
  - **presentation**
    - **components**
      - `WeatherCard.vue`
    - **views**
      - `Dashboard.vue`
  - **store** (if needed)
  - **composables** (if needed)
  - **types** (global types if needed)
  - `main.ts`
  - `App.vue`

## Pros and cons of DDD

### PROs

The beauty of this architecture lies in its flexibility and maintainability. Here are some key benefits:

1. **_Ubiquitous Language_**: DDD ensures that the terminology used in the codebase aligns closely with the language stakeholders use. This alignment makes it easier for developers to understand the codebase, even if they're not deeply familiar with it. For example, if stakeholders talk about "weather forecasts," the code will likely have entities or services named similarly, facilitating communication between stakeholders and developers.

2. **_Independent Layers_**: The architecture is structured into independent, isolated layers. This means future changes can be made without affecting the entire project. For instance, if you're using Vue in the presentation layer but decide to switch to React, you only need to modify the presentation layer. Similarly, the presentation and application layers don't need to know where data comes from; they simply request it (e.g., "Give me today's weather"). The infrastructure layer handles the data source, whether it's Firebase, SQL, or NoSQL. This decoupling allows for easy changes in data storage without impacting other layers.

3. **_Faster Onboarding_**: New developers can quickly grasp the project scope because they can focus on specific layers. For example, they might start with the display area without worrying about other layers. This leads to faster output and easier integration into the team as they gradually learn more about other layers.

4. **_Dedicated Teams_**: Depending on the project size, it's possible to have teams or team members responsible for specific layers. This setup facilitates easy communication between teams. For instance, the application team might ask the infrastructure team, "We need today's weather data in a specific format. Can you provide it?" The infrastructure team can fulfill this request without the application team needing to know the details of how the data is structured or retrieved.

5. **_Core Rules and Consistency_**: With DDD, there's a defined way to develop software based on the architecture. This leads to consistent coding standards across the team, making the code more maintainable and easier to understand.

### Cons

Key challenges with Domain-Driven Design (DDD):

1. **_Structural Complexity_**: Designing the right architecture (e.g., bounded contexts, aggregates, repositories) requires deep domain knowledge and experience. Over- or under-engineering layers or components can lead to unnecessary complexity or rigidity.

2. **_No Universal Template_**: DDD is a philosophy, not a step-by-step framework. Teams must adapt its principles to their domain, which can lead to trial-and-error iterations and refactoring as the domain evolves.

3. **_Learning Curve_**: While onboarding developers to isolated layers is easier, fully understanding the system’s interactions (e.g., how infrastructure integrates with the domain) demands experienced engineers. This contrasts with frameworks like Next.js, which provide more rigid, opinionated structures.

4. **_Overhead for Simple Projects_**: DDD is overkill for small-scale or CRUD-heavy applications. The upfront cost of defining layers and ubiquitous language may outweigh the benefits.

5. **_Organizational Alignment_**: DDD requires collaboration between developers, domain experts, and stakeholders. Without buy-in or clear communication, misalignment can derail the design.

## Developement and decisions

For starters, we're using vite for it's light speed, and for simplicity and to better allow responsiveness of CSS we're using tailwindCSS.
We are using brave as the development browser, and not focusing on testing multi browser although as the code should be simple this should behave well in different browsers.
We are not considering internationalization here. It is a very simple feature to add but in terms of priorities it doesn't take the top spot. Also, considering the small presentation layer code, we can later on add if we want to as it will not have an impact in an hipothetic roadmap.

Decided to go with a pre determined list of locations to explore.

Also, considered some properties for now such as temperature, humidity and wind speed.

Starting by defining the presentation layer and then will progressively implement the other layers. Presentation layer already depends on domain though, so I'll already add some entities.

For entities, we can immediately recognize Weather and Location as the 2 main ingredients for the purpose of the exercise.

As for the presentation, we'll have to use types obviously. In case of WeatherCard we need to type the properties. As this is a simple app, I'd usually leave the type inside the component itself, as the code doesn't get cluttered. However, as the app grows, it is a good practice to keep the types in a separate file, adjacent to the component, with the extension .types.ts

Entities for now have only the types of the represented entity. Entites can however have more than that, like specific validations to fields, or enforce correct creation of elements. e.g. a possibility would be to have Location entity creating readonly objects that represent the location itself as these are immutable.

Class based development works very well in some of these concepts, like setting entities, however due to the simplicity of the code so far, will do functional based code.
