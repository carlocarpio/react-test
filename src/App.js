import React, { Component } from 'react';
import API from './utils/apiwrapper';
import Field from './components/field';
import Select from './components/select';
import Table from './components/table';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasKey: false,
      keys: {
        read: '',
        admin: '',
      },
      rawdata: '',
      task: {
        title: '',
        description: '',
        priority: 2,
      },
      tasks: [
        {
          'title': 'Sample',
          'description': 'Sample Description',
          'priority': 1,
        },
      ]
    }
  }

  addTask = () => {
    const { rawdata, task }  = this.state
    const obj = rawdata[0].data.mossByte.object
    const taskItem = {
      title: task.title,
      description: task.description,
      priority: parseInt(task.priority)
    }
    obj.push(taskItem)
    const updateTask = {
      "object": obj
    }
    const { keys } = this.state;
    Promise.all([
      API.updateMossByte(updateTask, keys.admin),
    ])
    .then((data) => {
      this.getMossByte()
    })
    .catch((err) => {
      console.warn(err);
    });
  }

  createInitTask = () => {
    const { tasks }  = this.state
    const taskItem = { "object": tasks }
    Promise.all([
      API.createMossByte(taskItem),
    ])
    .then((res) => {
      this.setState({
        hasKey: true,
        keys: {
          read: res[0].data.mossByte.keys.read[0].key,
          admin: res[0].data.mossByte.keys.admin[0].key,
        }
      })
      this.getMossByte()
    })
    .catch((err) => {
      console.warn(err);
    });
  }

  getMossByte() {
    const { keys } = this.state;
    Promise.all([
      API.getMossByte(keys.read),
    ])
    .then((data) => {
      this.setState({ rawdata: data })
    })
    .catch((err) => {
      console.warn(err);
    });
  }

  removeAllTask = () => {
    const { keys } = this.state;
    Promise.all([
      API.removeMossByte(keys.admin),
    ])
    .then((data) => {
      this.setState({ rawdata: '', hasKey: false })
    })
    .catch((err) => {
      console.warn(err);
    });
  }

  updateTitle = (e) => {
    const task = this.state.task;
    task['title'] = e.target.value;
    this.setState({ task });
  }

  updateDescription = (e) => {
    const task = this.state.task;
    task['description'] = e.target.value;
    this.setState({ task });
  }

  updatePrio = (e) => {
    const task = this.state.task;
    task['priority'] = e.target.value;
    this.setState({ task });
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.addTask()
    this.setState({
      task: {
        title: '',
        description: '',
        priority: '',
      },
    })
  }

  renderCreateKey = () => {
    return (
      <div className="column is-half is-offset-one-quarter">
        <h2 className="title is-2">Get Key</h2>
        <button className="button is-primary" onClick={() => this.createInitTask()}>Create Todo</button>
      </div>
    )
  }

  renderMainContent = () => {
    return (
      <div className="column is-half is-offset-one-quarter">
        { this.renderForm() }
        { this.renderTable() }
      </div>
    )
  }

  renderForm = () => {
    const { task } = this.state
    return (
      <form onSubmit={this.handleSubmit}>
        <Field
          title="Task"
          onChange={this.updateTitle}
          type="text"
          value={task.title}
        />
        <Field
          title="Description"
          onChange={this.updateDescription}
          type="text"
          value={task.description}
        />
        <Select
          title="Priority"
          onChange={this.updatePrio}
          type="number"
          value={parseInt(task.priority)}
        />
        <div className="field is-grouped">
          <p className="control">
            <button className="button is-primary">Submit</button>
          </p>
          <p className="control">
            <a className="button is-danger" onClick={() => this.removeAllTask()}>Remove All Todos</a>
          </p>
        </div>
      </form>
    )
  }

  renderTable = () => {
    const { rawdata } = this.state
    return (
      <Table rawdata={rawdata} />
    )
  }
  
  render() {
    const { hasKey } = this.state
    return (
      <div className="App">
        <div className="columns">
          { hasKey ? this.renderMainContent() : this.renderCreateKey() }
        </div>
      </div>
    );
  }
}

export default App;