/** @jsx createVElement */

import {createVElement, thunk} from '../../../dist/module'

const jumbotron = (
  <div class="jumbotron">
    <div class="row">
      <div class="col-md-6">
        <h1>@transclusion/vdom v1.0.0-beta</h1>
      </div>
      <div class="col-md-6">
        <div class="row">
          <div class="col-sm-6 smallpad">
            <button type="button" on={{click: {type: 'run'}}} class="btn btn-primary btn-block">
              Create 1,000 rows
            </button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" on={{click: {type: 'runLots'}}} class="btn btn-primary btn-block">
              Create 10,000 rows
            </button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" on={{click: {type: 'add'}}} class="btn btn-primary btn-block">
              Append 1,000 rows
            </button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" on={{click: {type: 'update'}}} class="btn btn-primary btn-block">
              Update every 10th row
            </button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" on={{click: {type: 'clear'}}} class="btn btn-primary btn-block">
              Clear
            </button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" on={{click: {type: 'swapRows'}}} class="btn btn-primary btn-block">
              Swap Rows
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const rowView = ({row, selected}) => (
  <tr class={row.id === selected ? 'danger' : ''}>
    <td>{row.id}</td>
    <td>
      <a on={{click: {type: 'select', id: row.id}}}>{row.label}</a>
    </td>
    <td>
      <a on={{click: {type: 'delete', id: row.id}}}>Delete</a>
    </td>
    <td />
  </tr>
)

const tableView = ({rows, selected}) => (
  <table class="table table-hover table-striped">
    <tbody>{rows.map(row => thunk(rowView, {row, selected}))}</tbody>
  </table>
)

export default model => (
  <div id="root" class="container">
    {jumbotron}
    {tableView(model)}
  </div>
)
