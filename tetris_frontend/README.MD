Tetris - knockoff

Popular shape matching game from the 80's that I saw a YouTube tutorial on (https://www.youtube.com/watch?time_continue=1&v=rAUn1Lom6dw&feature=emb_logo || https://github.com/kubowania/Tetris).


Add Ons
2 additional shapes (z or s & j or l)
Created a level up/down button increasing the speed/points corresponding to the level.  
Added a rails backend to save all the scores
Made a top 10 list on the front end based on the 10 highest scores. 
Alert prompt stating the players score after game is over giving an option to enter name and submit score (if no name is present score will not be saved in the backend)
"Abort" button flipping the board around to look like you are doing something productive opposed the latter


All built on rails/js

Minor bugs/issues.

I never disabled the event listeners that move the shape when paused or at the start of the game.  i.e. one could technically play at a stand still without the gravity effect
I had issues accounting for unoccupied/occupied space during a shape rotation
Obviously my CSS is a nightmare
Amongst several others... but the above mentioned are the ones that bothered me the most


Gregg Garrison
https://github.com/gregggarrison


