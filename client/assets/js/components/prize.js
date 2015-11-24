import React, {Component} from 'react';
import classNames from 'classnames';
import PrizeAction from '../actions/prize';
import PrizeLotAction from '../actions/prize-lot';
import PrizeStore from '../stores/prize';
import PrizeLotStore from '../stores/prize-lot';

export default class Prize extends Component {
  state = {
    view: 0,
    prizes: [],
    lotResults: [],
    lotResultsSummary: []
  };
  constructor() {
    super();
    this._onChange = this._onChange.bind(this);
  }
  _handleViewClick(view) {
    this.setState({view: view});
  }
  _handleDrawClick() {
    let times = this.refs.times.value;
    times = Math.min(Math.max(1, times), 1000);
    this.refs.times.value = times;
    PrizeLotAction.draw(times);
  }
  _onChange() {
    this.setState({
      prizes: PrizeStore.prizes,
      lotResults: PrizeLotStore.results,
      lotResultsSummary: PrizeLotStore.resultsSummary
    });
  }
  componentDidMount() {
    PrizeStore.addChangeListener(this._onChange);
    PrizeLotStore.addChangeListener(this._onChange);
    PrizeAction.fetchAll();
  }
  componentWillUnmount() {
    PrizeStore.removeChangeListener(this._onChange);
    PrizeLotStore.removeChangeListener(this._onChange);
  }
  render() {
    let viewOptionNodes = [
      {key: 0, icon: 'fui-list-numbered'},
      {key: 1, icon: 'fui-list-thumbnailed'}
    ].map((e) => {
      let cls = classNames('btn', 'btn-primary', {active: e.key === this.state.view});
      return (
        <a key={`view-${e.key}`} className={cls} onClick={this._handleViewClick.bind(this, e.key)}>
          <span className={e.icon} />
        </a>
      );
    });

    let updated = this.state.prizes[0] ? new Intl.DateTimeFormat().format(new Date(this.state.prizes[0].date)) : '';

    let prizeNodes = this.state.prizes.map((prize) => {
      return (
        <tr key={prize.id}>
          <td className="">{prize.name}</td>
          <td className="">{prize.rate.toFixed(3)}</td>
        </tr>
      );
    });

    let i = 0;
    let lotResultsNodes = this.state.lotResults.map((result) => {
      return (
        <tr key={`result-${i++}`}>
          <td className="">{i}</td>
          <td className="">{result.name}</td>
        </tr>
      );
    });

    let j = 0;
    let lotResultsSummaryNodes = this.state.lotResultsSummary.map((result) => {
      return (
        <tr key={`result-summary-${j++}`}>
          <td className="">{result.prize.name}</td>
          <td className="">{result.count}</td>
          <td className="">{result.rate.toFixed(3)}</td>
        </tr>
      );
    });

    let lotNodes;
    if (this.state.view === 0) {
      lotNodes = (
        <table className="table table-hover">
          <thead>
          <tr>
            <th className="">#</th>
            <th className="">Name</th>
          </tr>
          </thead>
          <tbody>
          {lotResultsNodes}
          </tbody>
        </table>
      );
    } else {
      lotNodes = (
        <table className="table table-hover">
          <thead>
          <tr>
            <th className="">Name</th>
            <th className="">Count</th>
            <th className="">Rate</th>
          </tr>
          </thead>
          <tbody>
          {lotResultsSummaryNodes}
          </tbody>
        </table>
      );
    }

    return (
      <div className="container" id="prize">
        <div className="page-header">
          <h2>Prize</h2>
        </div>

        <div className="row">
          <div className="col-sm-6">
            <div className="clearfix">
              <h3>Draw Lots</h3>
            </div>

            <div className="input-group pull-left">
              <input type="text" className="form-control" min="1" max="1000" placeholder="1-1000"
                     ref="times" defaultValue="10" />
              <span className="input-group-btn">
                <button className="btn btn-primary" onClick={this._handleDrawClick.bind(this)}>Draw</button>
              </span>
            </div>

            <div className="btn-toolbar pull-right">
              <div className="btn-group">
                {viewOptionNodes}
              </div>
            </div>

            {lotNodes}
          </div>

          <div className="col-sm-6">
            <div className="clearfix">
              <h3>Prize List
                <small>Updated {updated}</small>
                <small className="pull-right">
                  <a href="http://lova.jp/prizelist/">to Official Prize List Page</a>
                </small>
              </h3>
            </div>

            <table className="table table-hover">
              <thead>
              <tr>
                <th className="">Name</th>
                <th className="">Rate</th>
              </tr>
              </thead>
              <tbody>
                {prizeNodes}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
