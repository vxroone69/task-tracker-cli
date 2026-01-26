const fs = require('fs');

function addTask(desc){
    const data = fs.readFileSync('tasks.json', 'utf8');
    const tasks = JSON.parse(data);
    const date = new Date();
    const time = date.toISOString();
    const newTask = { id : tasks.length + 1, 
        description : desc,
        createdAt: time, 
        updatedAt : time };
    tasks.push(newTask);
    fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
    console.log('Task added:', newTask);
}

const args = process.argv.slice(2);
if (args[0] === 'add') {
    addTask(args[1])
    return;
}

function listTasks(){
    const data = fs.readFileSync('tasks.json', 'utf-8');
    const tasks = JSON.parse(data);
    console.log('Tasks:');
    tasks.forEach(item => {
        console.log({ id: item.id, 
            description: item.description, 
            createdAt: item.createdAt,
            updatedAt: item.updatedAt });
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

    const task = tasks.find(item => item.id === parseInt(id));
    if (!task){
        console.log('Task with ID', id, 'not found.');
        return;
    }
    else {
        task.description = desc;
    }
    tasks.updatedAt = new Date().toISOString();

    fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
    console.log('Task updated with ID:', id);

}



if (args[0] === 'list'){
    listTasks();
}
else if (args[0] === 'delete'){
    deleteTask(parseInt(args[1]));
}
else if(args[0] === 'update'){
    updateTasks(parseInt(args[1]), args[2]);
}

