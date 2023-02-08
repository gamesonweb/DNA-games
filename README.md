***
# <p  align="center">[Multiplayer 3D Game](https://DNA-Game-Production.github.io/GamesOnWeb2023/) <font size="4">with [*Babylon.js*](https://www.babylonjs.com/)</font><p>
## <p  align="center">by *D.N.A. Production*<p>
***
  
# <p  align="center">[CLICK HERE TO PLAY THE GAME](https://DNA-Game-Production.github.io/GamesOnWeb2023/)</p>
  
***

# Launch the Game (Development)

In project's root:
- cargo run (lauch rust server)
- npm run startc (launch js client, works with starts too ?)

# Goal 
  The goal of this project was the creation of a 3D Multiplayer Survival RPG game with [<b>Babylon.js</b>](https://www.babylonjs.com/) in Spring of 2023 for the Game on Web 2023 contest. The theme was "XXXXXXX".
  
***

# The *D.N.A. Production* team

FISSORE Davide | BERNIGAUD Noé 
:-------------------------:|:-------------------------:|:-------------------------:
<img src="https://zupimages.net/up/23/06/ol5u.png" alt="Fissore Davide" width="200"/> | <img src="https://zupimages.net/up/22/19/dak6.png" alt="BERNIGAUD Noé" width="200"/>

We are two students at the University of Côte d'Azur. Together, we form <b>*D.N.A. Production*</b>.
  
<ul>
  <li>FISSORE Davide was in charge of the menus and the structure of the project.</li>
  <li>BERNIGAUD Noe was taking care of the Rust server, map creation, and the musics and sound effects.</li>
</ul>

However, despite our specialization that occured during the project, we always stayed polyvalent and one of the main strenght of our team was our ability to meet very regularly and help each other out in all domains of the development. The coding of the game's logic and render in Babylonjs was shared by all three of us.
  
***

Structure
-npm, lancement de l'IA depuis le serveur

Serveur
-comment le serveur marche, quel est son role
-version originel d'un terrain plat, des joueurs qui bougent et un mini-chat

Collisions
-Difficultés avec les déplacement des zombies
-Changement des collisions sur les models vers des collisions par hitbox

Terrain
-problematique serveur (pas de heightmap)
-Blender (shader, ANT landscape...)
-problématiques d'export

Gravité & Saut
-laser and moves every frames

Camera
-caméra s'enfonce dans les textures, utilisation d'un système de laser

Déploiement
-github pages + Heroku, problématique Heroku
