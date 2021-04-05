import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';

import { Col, ControlLabel, FormGroup, Row, Button } from 'react-bootstrap';

import moment from 'moment';

import { countDiffDay } from '../../../helpers/dates';

class SearchFromThruDate extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);

    const { fromDateDefault, thruDateDefault } = this.props;

    this.state = {
      fromDate: fromDateDefault,
      thruDate: thruDateDefault,
    };
  }

  handleSubmit = () => {
    const { onChange } = this.props;
    const { fromDate, thruDate } = this.state;
    onChange(fromDate, thruDate);
  };

  handleFromDate = (event) => {
    const { settings } = this.props;
    const { thruDate } = this.state;

    const fromMoment = moment(event.target.value).tz(settings.timezone);

    let thruDateNew = thruDate || fromMoment.add(1, 'days').format('YYYY-MM-DD');

    const masa = countDiffDay(
      new Date(event.target.value),
      new Date(thruDateNew),
      settings.timezone,
    );

    if (masa < 1) thruDateNew = fromMoment.add(1, 'days').format('YYYY-MM-DD');
    if (masa > 31) thruDateNew = fromMoment.add(1, 'months').format('YYYY-MM-DD');

    this.setState({ fromDate: event.target.value, thruDate: thruDateNew });
    this.form.thruDate.value = thruDateNew;
    // onChange(event.target.value, thruDateNew);
  };

  handleThruDate = (event) => {
    const { settings } = this.props;
    const { fromDate } = this.state;

    const thruMoment = moment(event.target.value).tz(settings.timezone);

    let fromDateNew = fromDate || thruMoment.subtract(1, 'days').format('YYYY-MM-DD');

    const masa = countDiffDay(
      new Date(fromDateNew),
      new Date(event.target.value),
      settings.timezone,
    );

    if (masa < 1) fromDateNew = thruMoment.subtract(1, 'days').format('YYYY-MM-DD');
    if (masa > 31) fromDateNew = thruMoment.subtract(1, 'months').format('YYYY-MM-DD');

    this.setState({ fromDate: fromDateNew, thruDate: event.target.value });
    this.form.fromDate.value = fromDateNew;
    // onChange(fromDateNew, event.target.value);
  };

  render() {
    const { fromDateDefault, thruDateDefault } = this.props;

    return (
      <form
        ref={(form) => (this.form = form)}
        onSubmit={(event) => {
          event.preventDefault();
          this.handleSubmit();
        }}
      >
        <Row>
          <Col xs={6} md={4}>
            <FormGroup>
              <ControlLabel>From Date</ControlLabel>
              <input
                type="date"
                name="fromDate"
                className="form-control"
                defaultValue={fromDateDefault}
                onChange={this.handleFromDate}
              />
            </FormGroup>
          </Col>
          <Col xs={6} md={4}>
            <FormGroup>
              <ControlLabel>Thru Date</ControlLabel>
              <input
                type="date"
                name="thruDate"
                className="form-control"
                defaultValue={thruDateDefault}
                onChange={this.handleThruDate}
              />
            </FormGroup>
          </Col>
          <Col xs={12} md={4}>
            <FormGroup>
              <ControlLabel>&nbsp;</ControlLabel>
              <Button type="submit" bsStyle="success">
                Search
              </Button>
            </FormGroup>
          </Col>
        </Row>
      </form>
    );
  }
}

SearchFromThruDate.defaultProps = {
  onChange: (fromDateSearch, thruDateSearch) => {
    this.setState({ fromDate: fromDateSearch, thruDate: thruDateSearch });
  },
  settings: { timezone: 'Asia/Jakarta' },
  fromDateDefault: undefined,
  thruDateDefault: undefined,
};

SearchFromThruDate.propTypes = {
  onChange: PropTypes.func,
  settings: PropTypes.object,
  fromDateDefault: PropTypes.string,
  thruDateDefault: PropTypes.string,
};

export default SearchFromThruDate;
