import styled from 'styled-components';
import { Tabs } from 'react-bootstrap';

const UserHeader = styled.h4`
  .label {
    position: relative;
    top: -2px;
    font-size: 10px;
  }

  .label-Facebook {
    background: var(--facebook);
    color: #fff;
  }

  .label-Google {
    background: var(--google);
    color: #fff;
  }

  .label-GitHub {
    background: var(--github);
    color: #fff;
  }
`;

const UserTabs = styled(Tabs)`
  .nav.nav-tabs {
    margin-bottom: 20px;
  }
`;

export default {
  UserHeader,
  UserTabs,
};
