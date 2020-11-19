import React from 'react';
import PropTypes from 'prop-types';

import { Col, FormGroup, Row } from 'react-bootstrap';

import Validation from '../Validation';

class SearchBar extends React.Component {
  handleSubmit = (form) => {
    const { rootPath, history } = this.props;
    const path = form.keyword.value ? `/search/${form.keyword.value.trim()}` : '';
    history.push(`${rootPath}${path}`);
  };

  render() {
    const { placeholder, settings, match } = this.props;

    return (
      <Validation
        rules={{
          keyword: {
            minlength: settings.minCharSearch || 3,
          },
        }}
        messages={{
          keyword: {
            required: 'search needs at least 3 characters',
          },
        }}
        submitHandler={(form) => this.handleSubmit(form)}
      >
        <form ref={(form) => (this.form = form)} onSubmit={(event) => event.preventDefault()}>
          <Row>
            <Col xs={12}>
              <FormGroup>
                <input
                  type="text"
                  name="keyword"
                  className="form-control"
                  placeholder={placeholder}
                  defaultValue={match && match.params && match.params.keyword}
                />
              </FormGroup>
            </Col>
          </Row>
        </form>
      </Validation>
    );
  }
}

SearchBar.defaultProps = {
  placeholder: 'Search...',
  match: undefined,
};

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  rootPath: PropTypes.string.isRequired,
  match: PropTypes.object,
  settings: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default SearchBar;
