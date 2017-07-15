import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import API from './utils/apiwrapper';
import Field from './components/field';
import Select from './components/select';
import Table from './components/table';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeIndex: '',
      activeTask: [],
      formValid: false,
      hasKey: false,
      keys: {
        read: '',
        admin: '',
      },
      rawdata: '',
      task: {
        id: moment().valueOf(),
        title: '',
        description: '',
        priority: '4',
      },
      tasks: [
        {
          'id': moment().valueOf(),
          'title': '',
          'description': '',
          'priority': '1',
        },
      ],
      isEdit: false,
      isModalActive: false,
    }
  }

  checkForm = () => {
    const { task } = this.state;
    task.title !== ''&&
    task.description !== '' &&
    task.priority ?
      this.setState({ formValid: true }) :
      this.setState({ formValid: false })
  }

  addTask = () => {
    const { keys, rawdata, task }  = this.state
    const obj = rawdata[0].data.mossByte.object
    const taskItem = {
      id: moment().valueOf(),
      title: task.title,
      description: task.description,
      priority: task.priority
    }
    obj.push(taskItem)
    const updateTask = {
      "object": obj,
    }
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

  editTask = (item, i) => {
    const { activeIndex, keys, rawdata, task }  = this.state
    const obj = rawdata[0].data.mossByte.object
    const data = {
      "object": obj,
      "rollback": false,
      "instructions": [
        {
          "function": "set",
          "key": activeIndex,
          "value": { task }
        }
      ]
    }
    Promise.all([
      API.editMossByte(data, keys.admin),
    ])
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

  removeTask = (id) => {
    const { rawdata , keys}  = this.state
    const obj = rawdata[0].data.mossByte.object
    const objReduced =  _.reject(obj, function(o) { return o.id === id; });
    const updateTask = { "object": objReduced }
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

  updateTitle = (e) => {
    const task = this.state.task;
    task['title'] = e.target.value;
    this.setState({ task });
    this.checkForm()
  }

  updateDescription = (e) => {
    const task = this.state.task;
    task['description'] = e.target.value;
    this.setState({ task });
    this.checkForm()
  }

  updatePrio = (e) => {
    const task = this.state.task;
    task['priority'] = e.target.value;
    this.setState({ task });
    this.checkForm()
  }

  handleSubmit = (e) => {
    const { isEdit } = this.state
    e.preventDefault()
    isEdit ? this.editTask() : this.addTask()
    this.setState({
      isEdit: false,
      isModalActive: false,
      task: {
        title: '',
        description: '',
        priority: '4',
      },
    })
  }

  openModal = (item, i) => {
    this.setState({
      activeIndex: i,
      isEdit: !this.state.isEdit,
      isModalActive: !this.state.isModalActive,
      task: item,
    })
  }

  closeModal = () => {
    this.setState({isModalActive: false, isEdit: false})
  }

  renderCreateKey = () => {
    return (
      <div className="column is-half is-offset-one-quarter">
        <h2 className="title is-2">Get Key</h2>
        <button className="button is-primary" onClick={() => this.createInitTask()}>Create Todos</button>
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
    const { isEdit, task, formValid } = this.state
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
          value={task.priority}
        />
        <div className="field is-grouped btn-form-group">
          <p className="control">
            <button className="button is-primary" disabled={!formValid}>Submit</button>
          </p>
          <p className={`${isEdit && `is-hidden`}  control`}>
            <a className="button is-danger" onClick={() => this.removeAllTask()}>Remove All Todos</a>
          </p>
        </div>
      </form>
    )
  }

  renderTable = () => {
    const { rawdata } = this.state
    return (
      <Table
        rawdata={rawdata}
        editTask={this.editTask}
        removeTask={this.removeTask}
        openModal={this.openModal}
      />
    )
  }

  renderModal = () => {
    const { isModalActive } = this.state
    const modalClass = [ isModalActive ? 'modal is-active' : 'modal' ]
    return (
       <div id="modal-bis" className={modalClass}>
        <div className="modal-background"></div>
        <div className="modal-content">
          { this.renderForm() }
        </div>
        <button
          className="modal-close is-large"
          onClick={() => this.closeModal()}
        >
        </button>
      </div>
    )
  }
  
  render() {
    const { hasKey, isModalActive } = this.state
    return (
      <div className="App">
        <div className="columns">
          { hasKey ? this.renderMainContent() : this.renderCreateKey() }
        </div>
       { this.renderModal() }
      </div>
    );
  }
}

export default App;
