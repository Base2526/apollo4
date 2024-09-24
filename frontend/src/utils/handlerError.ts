import { ApolloError } from '@apollo/client';
import _ from 'lodash';
import { message } from 'antd';
import * as constants from '@/constants'; // Adjust the import path to your constants

interface GraphQLErrorExtensions {
    code?: string;
}

interface GraphQLError {
    message: string;
    extensions?: GraphQLErrorExtensions;
}

interface HandlerErrorProps {
    logout?: () => void;
}

const handlerError = (props: any, error: ApolloError) => {
    if (error.networkError) {
        // Handle network errors
        message.error('Network error occurred'); // Replace with your own error message
        console.error('Network error:', error.networkError);
        return;
    }

    error.graphQLErrors.forEach((e: GraphQLError) => {
        const code = e.extensions?.code;

        switch (code) {
            case constants.FORCE_LOGOUT: {
                const { logout } = props;
                message.error('Force logout required'); // Replace with your own error message
                logout && logout();
                break;
            }

            case constants.DATA_NOT_FOUND:
            case constants.UNAUTHENTICATED:
            case constants.ERROR: {
                message.error(e.message);
                break;
            }

            case constants.USER_NOT_FOUND:
            case constants.PASSWORD_WRONG:
            case constants.NOT_ENOUGH_BALANCE:
            case constants.EXPIRE_DATE: {
                message.error('Error: ' + code); // Replace with your own error message
                console.log(`Error code: ${code}`);
                break;
            }

            case constants.INTERNAL_SERVER_ERROR: {
                message.error('Internal server error occurred'); // Replace with your own error message
                break;
            }

            default: {
                console.error('Unhandled error:', e);
            }
        }
    });
};

export default handlerError;
