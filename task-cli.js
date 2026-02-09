import { nanoid } from 'nanoid';
import fs from 'fs';
import readline from 'readline';

function addTask(desc){
    const data = fs.readFileSync('tasks.json', 'utf8');
    const tasks = JSON.parse(data);
    const date = new Date();
    const time = date.toISOString();
    let id = nanoid(3);
    // Prevent collision: regenerate ID if it already exists
    while (tasks.some(task => task.id === id)) {
        id = nanoid(3);
    }
    const newTask = { id : id, 
        description : desc,
        createdAt: time, 
        updatedAt : time,
        status: "pending" };
    tasks.push(newTask);
    fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
    console.log('Task added:', newTask);
}

const args = process.argv.slice(2);


function listTasks(){
    const data = fs.readFileSync('tasks.json', 'utf-8');
    const tasks = JSON.parse(data);
    console.log('Tasks:');
    tasks.forEach(item => {
        console.log({ id: item.id, 
            description: item.description, 
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        status: item.status });
    });

}

function deleteTask(id){
    //1.check if id is provided or not
    if (!id) {
        console.log('Please provide an ID to delete a task.');
    }
    //2.read the tasks from tasks.json
    const data = fs.readFileSync('tasks.json', 'utf8');
    const tasks = JSON.parse(data);

    //3.find the task with the given id and delete it
    const updTasks = tasks.filter(item => item.id !== id);

    //4.check if anything has been deleted. if not, print task not found
    if (updTasks.length == tasks.length) {
        console.log('Task with ID', id, 'not found.');
        return;
    }

    //5.write the updated tasks back to tasks.json
    fs.writeFileSync('tasks.json', JSON.stringify(updTasks, null, 2)) ;
    console.log('Task deleted with ID:', id);
    
}

function updateTasks(id, desc){
    //1.check if id and desc is provided or not
    if (!id || !desc) {
        console.log('Please provide both ID and description to update a task.')
        return;
    }
    const data = fs.readFileSync('tasks.json', 'utf-8');
    const tasks = JSON.parse(data);

    const task = tasks.find(item => item.id === id);
    if (!task){
        console.log('Task with ID', id, 'not found.');
        return;
    }
    else {
        task.description = desc;
    }
    task.updatedAt = new Date().toISOString();

    fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
    console.log('Task updated with ID:', id);

}

function markasdone(id){
    if (!id){
        console.log('Please provide an ID to mark as done.');
    }
    const data = fs.readFileSync('tasks.json', 'utf-8');
    const tasks = JSON.parse(data);

    const task = tasks.find(item => item.id === id);
    if(!task){
        console.log('Task with ID', id, 'not found.');
        return;
    }
    task.status = 'done';
    task.updatedAt = new Date().toISOString();

    fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
    console.log('Task marked as done with ID:', id);

}

function markinprogress(id){
    const data = fs.readFileSync('tasks.json');
    const tasks = JSON.parse(data);
    const task = tasks.find(task => task.id === id);
    if(!task){
        console.log('Task with ID', id, 'not found.');
        return;
    }
    task.status = 'in-progress';
    task.updatedAt = new Date().toISOString();
    fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
    console.log('Task marked as in-progress with ID:', id);
}

function deleteall(){
    fs.writeFileSync('tasks.json', JSON.stringify([], null, 2));
    console.log('All tasks deleted.');
}

// Interactive Menu
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function showMenu() {
    console.log('\n========== TASK MANAGER MENU ==========');
    console.log('1. List all tasks');
    console.log('2. Add a new task');
    console.log('3. Update a task');
    console.log('4. Mark task as done');
    console.log('5. Mark task as in-progress');
    console.log('6. Delete a task');
    console.log('7. Delete all tasks');
    console.log('8. Exit');
    console.log('======================================\n');

    const choice = await askQuestion('Enter your choice (1-8): ');

    switch(choice) {
        case '1':
            listTasks();
            break;
        case '2':
            const desc = await askQuestion('Enter task description: ');
            if (desc.trim()) {
                addTask(desc);
            } else {
                console.log('Task description cannot be empty.');
            }
            break;
        case '3':
            listTasks();
            const updateId = await askQuestion('Enter task ID to update: ');
            const newDesc = await askQuestion('Enter new description: ');
            if (newDesc.trim()) {
                updateTasks(updateId, newDesc);
            } else {
                console.log('Description cannot be empty.');
            }
            break;
        case '4':
            listTasks();
            const doneId = await askQuestion('Enter task ID to mark as done: ');
            markasdone(doneId);
            break;
        case '5':
            listTasks();
            const progressId = await askQuestion('Enter task ID to mark as in-progress: ');
            markinprogress(progressId);
            break;
        case '6':
            listTasks();
            const deleteId = await askQuestion('Enter task ID to delete: ');
            deleteTask(deleteId);
            break;
        case '7':
            const confirm = await askQuestion('Are you sure you want to delete all tasks? (yes/no): ');
            if (confirm.toLowerCase() === 'yes') {
                deleteall();
            } else {
                console.log('Cancelled.');
            }
            break;
        case '8':
            console.log('Goodbye!');
            rl.close();
            return;
        default:
            console.log('Invalid choice. Please enter a number between 1 and 8.');
    }

    // Show menu again after action completes
    showMenu();
}

// CLI Mode (for command-line arguments) or Interactive Menu
if (args.length === 0) {
    // No arguments provided - show interactive menu
    showMenu();
} else if (args[0] === 'list'){
    listTasks();
}
else if (args[0] === 'delete'){
    deleteTask(args[1]);
}
else if(args[0] === 'update'){
    updateTasks(args[1], args[2]);
}
else if(args[0] === 'done'){
    markasdone(args[1]);
}
else if(args[0] === 'in-progress'){
    markinprogress(args[1]);
}
else if (args[0] === 'add'){
    addTask(args[1]);
}
else if (args[0] === 'delete all'){
    deleteall();
}
else {
    console.log('Unknown command. Run "node task-cli.js" for interactive menu.');
}

