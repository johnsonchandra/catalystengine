import styled from 'styled-components';

export const StyledLogin = styled.div`
  border: 1px solid var(--gray-lighter);
  padding: 25px;
  border-radius: 3px;
  max-width: 768px;
  margin: 0 auto;

  .page-header {
    margin-top: 0;
  }

  > .row {
    margin: 0 !important;
  }

  button[type='submit'] {
    height: 41px;
    margin-top: 20px;
  }

  @media screen and (min-width: 768px) {
    padding: 0;
    margin-top: 0px;
    display: flex;
    flex-direction: row;

    > .row {
      width: 55%;
      padding: 40px 25px;
    }
  }

  @media screen and (min-width: 992px) {
    max-width: 900px;

    > .row {
      width: 50%;
    }
  }
`;

export const LoginPromo = styled.div`
  display: none;

  @media screen and (min-width: 768px) {
    display: flex;
    margin: 0;
    width: 45%;
    padding: 25px;
    border-radius: 3px 0 0 3px;
    margin: -1px 0 -1px -1px;
    text-align: center;
    justify-content: center;
    align-items: center;

    img {
      width: 100px;
      height: auto;
      margin: 0 0 25px;
      border-radius: 3px;
    }

    h4 {
      margin: 0;
      color: #000;
      font-size: 24px;
      line-height: 32px;
    }

    p {
      color: #000;
      font-size: 18px;
      line-height: 26px;
      margin-top: 10px;
      opacity: 0.6;
    }
  }

  @media screen and (min-width: 992px) {
    padding: 0;
    width: 50%;
    min-height: 400px;

    p {
      display: inline-block;
      font-size: 20px;
      line-height: 28px;
      max-width: 70%;
      margin: 10 auto 0;
    }
  }
`;
