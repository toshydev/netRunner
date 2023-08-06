import styled from "@emotion/styled";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const StyledToastContainer = styled(ToastContainer)`
  .Toastify__toast {
    text-align: center;
    width: 100%;
    max-width: 50rem;
    font-family: inherit;
  }

  .Toastify__toast--error {
    background-color: var(--color-secondary);
    color: black;
    filter: drop-shadow(0 0 0.75rem var(--color-secondary));

    .Toastify__progress-bar {
      background-color: var(--color-primary);
    }
  }

  .Toastify__toast--success {
    background-color: var(--color-primary);
    color: black;
    filter: drop-shadow(0 0 0.75rem var(--color-primary));

    .Toastify__progress-bar {
      background-color: var(--color-secondary);
    }
  }

  .Toastify__close-button {
    opacity: 1;
  }
`;
