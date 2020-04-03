console.log('Hello word')
/*
Approach: 
- Store the current position in an x,y position
- Move based on input direction and limitations of the grid
- Once move is done, check a hash table with all the dirt coordinates to see if we picked up dirt
- Do this for all movements until end
- At end, return final coordinate and count hash table of dirt

I could have chosen to use a 2d array, but it comes at the cost of using much more memory and more traversals
at the end when dirt needs to be counted by traversing the entire 2d array.
This has a lower time complexity at scale reducing the potential O(n^2) of a 2d array traversal to
an call of dictionary.length to get the remaining dirt.
The space complexity is the size of the dirt dictionary against a 2d array.

I would only use the 2d array approach if there was an AI associated with the roomba
i.e. the roomba decides what to do by looking around itself which can be done with a 2d array
*/

/*
Test cases:
//Cross x in all dir,cross y bound in all dir, collect all dirt
4 1
0 0
1 0
2 0
NNSEEEWWWw

0 0
3

//no dirt
4 4
1 3
NESSSSWWWS

0 0
0

//Basic case
5 5
1 2
1 0
2 2
2 3
NNESEESWNWW

1 3
1

//Small grid
1 1
0 0
0 0
NEWS

0 0
1


Error checks:
- File not there
- Grid has no area, size less than 1
- Start position outside of grid
- NESW are the only letters used
*/

//Get data from the input text file 
const fs = require('fs')
var data = "";
try {
  data = fs.readFileSync('./input.txt', 'utf8')
} catch (err) {
  console.error(err)
}


//Extract the grid dimensions, starting position, dirt, and directions
lines = data.split("\n")

//Grid Dimensions
grid_size = lines[0].trim().split(' ')
x_max = parseInt(grid_size[0])
y_max = parseInt(grid_size[1])

//Grid is valid
if(x_max < 1|| y_max < 1) {
	console.log("Invalid grid")
}


//Starting position
start_coord = lines[1].trim().split(' ')
start_x = parseInt(start_coord[0])
start_y = parseInt(start_coord[1])
//no dirt situation
if (lines.legnth <= 3){ 
	console.log(start_coord[0].concat(' ', start_coord[1]))
	console.log('0')
}

if(start_x < 0 || start_x >= x_max || stary_y < 0 || start_y >= y_max) {
	console.log("Invalid start position")
}

//Create a hashmap for the dirt
var dirt = new Object()

function coord_to_str(x, y){
	return x.toString().concat(' ', y.toString())
}

for(i=2; i < lines.length-1; i++){
	cur_dirt_pos = lines[i].trim().split(' ')
	dirt_x = parseInt(cur_dirt_pos[0])
	dirt_y = parseInt(cur_dirt_pos[1])
	dirt[cur_dirt_pos[0].concat(' ', cur_dirt_pos[1])] = 1
}
dirt_orig = Object.keys(dirt).length


//Given a set of coordinates, limitations, and a direction, give the next coordinate after moving
function move_in_grid(x, y, x_bound, y_bound, dir){
	//0,0 is bottom left
	//N is y+1
	//S is y-1
	//E is x+1
	//W is x-1
	switch(dir) {
		case "N":
			if(y+1 < y_bound){
				return [x, y+1] //Move up
			} else {
				return [x, y] //Can't move up, already at limit
			}
		case "S":
			if(y-1 >= 0){
				return [x, y-1]
			} else {
				return [x, y]
			}
		case "E":
			if(x+1 < x_bound) {
				return [x+1, y]
			} else {
				return [x, y]
			}
		case "W":
			if(x-1 >= 0){
				return [x-1, y]
			} else {
				return [x, y]
			}
		default:
			console.log("Invalid character used")
	}
}

//Delete dirt
function delete_dirt(x,y, dirt_dict){
	cur_to_str = coord_to_str(x, y)
	if (cur_to_str in dirt_dict) {
		delete dirt_dict[cur_to_str]
		//console.log('deleted! at',x.toString(), ' ', y.toString())
	}
}

//Cycle through directions and get 
directions = lines[lines.length-1].trim()
cur_x = start_x
cur_y = start_y

//Check if start position clears dirt because roomba lands there
delete_dirt(cur_x, cur_y, dirt)
for(dir_num=0; dir_num < directions.length; dir_num++){
	//Get new position
	new_coord = move_in_grid(cur_x, cur_y, x_max, y_max, directions[dir_num])
	cur_x = new_coord[0]
	cur_y = new_coord[1]
	//console.log("current pos ay", cur_x.toString(), ' ', cur_y.toString())
	//Remove dirt accordingly
	delete_dirt(cur_x, cur_y, dirt)
}

//Output
console.log(''.concat(cur_x, ' ', cur_y))
console.log(dirt_orig - Object.keys(dirt).length)
