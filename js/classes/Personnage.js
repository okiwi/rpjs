var DIRECTION = {
	"BAS"    : 10,
	"GAUCHE" : 11,
	"DROITE" : 12,
	"HAUT"   : 13
};

var PROBLEMS = {
	"NONE" : 20,
	"ANIMATION_STILL_IN_PROGRESS" : 21,
	"CANNOT_MOVE_PLAYER" : 22,
	"MOVE_MAP_DOWN": 23,
	"MOVE_MAP_UP": 24,
	"MOVE_MAP_RIGHT": 25,
	"MOVE_MAP_LEFT": 26
};

var DUREE_ANIMATION = 4;
var DUREE_DEPLACEMENT = 15;

function Personnage(url, x, y, direction) {
	this.x = x; // (en cases)
	this.y = y; // (en cases)
	this.direction = direction;
	this.etatAnimation = -1;
	
	// Chargement de l'image dans l'attribut image
	this.image = new Image();
	this.image.referenceDuPerso = this;
	this.image.onload = function() {
		if(!this.complete) 
			throw "Erreur de chargement du sprite nommé \"" + url + "\".";
		
		// Taille du personnage
		this.referenceDuPerso.largeur = this.width / 4;
		this.referenceDuPerso.hauteur = this.height / 4;
	}
	this.image.src = "sprites/" + url;
}

Personnage.prototype.dessinerPersonnage = function(context) {
	var frame = 0; // Numéro de l'image à prendre pour l'animation
	var decalageX = 0, decalageY = 0; // Décalage à appliquer à la position du personnage
	if(this.etatAnimation >= DUREE_DEPLACEMENT) {
		// Si le déplacement a atteint ou dépassé le temps nécéssaire pour s'effectuer, on le termine
		this.etatAnimation = -1;
	} else if(this.etatAnimation >= 0) {
		// On calcule l'image (frame) de l'animation à afficher
		frame = Math.floor(this.etatAnimation / DUREE_ANIMATION);
		if(frame > 3) {
			frame %= 4;
		}
		
		// Nombre de pixels restant à parcourir entre les deux cases
		var pixelsAParcourir = 32 - (32 * (this.etatAnimation / DUREE_DEPLACEMENT));
		
		// À partir de ce nombre, on définit le décalage en x et y.
		if(this.direction == DIRECTION.HAUT) {
			decalageY = pixelsAParcourir;
		} else if(this.direction == DIRECTION.BAS) {
			decalageY = -pixelsAParcourir;
		} else if(this.direction == DIRECTION.GAUCHE) {
			decalageX = pixelsAParcourir;
		} else if(this.direction == DIRECTION.DROITE) {
			decalageX = -pixelsAParcourir;
		}
		
		// On incrémente d'une frame
		this.etatAnimation++;
	}
	/*
	 * Si aucune des deux conditions n'est vraie, c'est qu'on est immobile, 
	 * donc il nous suffit de garder les valeurs 0 pour les variables 
	 * frame, decalageX et decalageY
	 */
	
	context.drawImage(
		this.image, 
		this.largeur * frame, this.direction * this.hauteur, // Point d'origine du rectangle source à prendre dans notre image
		this.largeur, this.hauteur, // Taille du rectangle source (c'est la taille du personnage)
		// Point de destination (dépend de la taille du personnage)
		(this.x * 32) - (this.largeur / 2) + 16 + decalageX, (this.y * 32) - this.hauteur + 24 + decalageY,
		this.largeur, this.hauteur // Taille du rectangle destination (c'est la taille du personnage)
	);
}

Personnage.prototype.getCoordonneesAdjacentes = function(direction) {
	var coord = {'x' : this.x, 'y' : this.y};
	switch(direction) {
		case DIRECTION.BAS : 
			coord.y++;
			break;
		case DIRECTION.GAUCHE : 
			coord.x--;
			break;
		case DIRECTION.DROITE : 
			coord.x++;
			break;
		case DIRECTION.HAUT : 
			coord.y--;
			break;
	}
	return coord;
}

Personnage.prototype.deplacer = function(direction, map) {
	// On ne peut pas se déplacer si un mouvement est déjà en cours !
	if(this.etatAnimation >= 0) {
		return PROBLEMS.ANIMATION_STILL_IN_PROGRESS;
	}

	// On change la direction du personnage
	this.direction = direction;
		
	// On vérifie que la case demandée est bien située dans la carte
	var prochaineCase = this.getCoordonneesAdjacentes(direction);
	console.log("ACTUAL_CASE: ", this.x, this.y);
	console.log("NEXT_CASE: ", prochaineCase.x, prochaineCase.y);
	if(prochaineCase.x < 0 || prochaineCase.y < 0 || prochaineCase.x >= map.getLargeur() || prochaineCase.y >= map.getHauteur()) {
		return PROBLEMS.CANNOT_MOVE_PLAYER;

	} else if(prochaineCase.y >= map.getDisplayedHeight()) {
		return PROBLEMS.MOVE_MAP_DOWN;
		
	} else if(prochaineCase.y <= map.getDisplayedHeight()) {
		return PROBLEMS.MOVE_MAP_UP;
		
	} else if(prochaineCase.x >= map.getDisplayedWidth()) {
		return PROBLEMS.MOVE_MAP_RIGHT;

	} else if(prochaineCase.x <= map.getDisplayedWidth()) {
		return PROBLEMS.MOVE_MAP_LEFT;
	}
	
	// On commence l'animation
	this.etatAnimation = 1;
		
	// On effectue le déplacement
	this.x = prochaineCase.x;
	this.y = prochaineCase.y;

	console.log(this.x, this.y);
		
	return PROBLEMS.NONE;
}

Personnage.prototype.getCoordinates = function() {
	return {x: this.x, y: this.y};
};

Personnage.prototype.setCoordinates = function(coordinates) {
	this.x = coordinates.x;
	this.y = coordinates.y;
};
