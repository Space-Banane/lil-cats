Prompts:
## -------------------- Start Prompt ------------------
- Build an App where a cat follows the user's cursor around with a slight delay.  
- Add a setting to control how many cats should spawn, and a control for the random and manual spawning of food and cats.
- Use emojis for the cats and ensure the design is sleek, with a dark mode toggle for a modern look.  
```md
### Features:
1. **Cat Cursor Follow**:  
    - The nearest cat should follow the user's cursor with a delay.  
    - This behavior should only activate when the user enables it via a toggle.  
    - The toggle is triggered by a right-click, and the cursor design should indicate the toggle state.  

2. **Feeding the Cats**:  
    - Add a button to "feed" the cats.  
    - When pressed, food should randomly spawn on the screen.  
    - The cats should automatically run to the nearest food.  

### Development Notes:
- Keep all logic in a single file to avoid unnecessary complexity.  
- Reuse components and organize them into a `src/components` folder.  
  - For example, create separate components for the cat and the food.  
- Ensure the implementation is clean and user-friendly using tailwind CSS.
```

## ------------------ Adjustments ------------------


Adjust the cats to runaround sometimes a little bit. So even without the cursor. Make them run at eachother and away from each other. Also make them run around the screen a little bit.

Add functionality to Randomly add cats to the site.

Adjust the app to use a few diffrent emojis too for the cats, for example:
- Running: 🐈
- Sleeping: 💤
- Eating: 🍽😸
- Playing: 😺
- Sitting: 🐈‍⬛


Also fix the bug right now where the cats ALL move to the same food item when a food item is spawned.

Also implement the "killing" of cats. When i click on a cat, it should switch its emoji to 😾 and if i click again it should go to 🗑️❌ and after a second it delets the cat. I want it to go from the angry emoji back to the normal one after 3 seconds btw. So its like a angry mode.



Add a little navbar to the app, showing "lil-cats" and move all of the buttons to the navbar. The navbar should be sticky and always on top of the screen. The buttons should be "Add Cat", "Add Food", "Remove All Cats" and "Remove All Food" and the rest ofc. The buttons should be in a row and centered in the navbar. The navbar should have a little bit of a dark background color and the buttons should have a lighter tahn the background color with white text ish. The buttons should have a hover effect that changes the background color to a lighter shade of the same color.



## -------------------- Fixing ------------------
There are still a few Bugs. 
1. The cats dont run around the screen.
2. The cats dont do the requested featues if they are clicked on.
3. The cats lag and the site is a bit unstable.


Please fix this and stick the navbar to the top of the page, with a mt-2 margin


## -------------------- Second Fix Prompt -------------------
Sadly the Add Food button only works once
(Crashed after 15 seconds but told me where the issue is)
### ---- Restarted Prompt ----
Can you fix the issue I noted above with the add food not working?



## ---------------------- End Prompt -------------------
Okay, now lets add the finishing touches to this project.

- Modify the index.html file to include meta tags for viewport, charset, and description and that kind of stuff.
- Add a robots.txt file to the project. (allow all)
- Add a sitemap.xml file to the project. (one route)
- Add a .gitignore file to the project. (node_modules, dist, .env)
- Add a README.md file to the project. (with a description of the project, how to run it, and how to contribute)
- Clean up code.