import React, { FC } from "react";

import styled from 'styled-components';
import { Space, Input, Avatar, Button, Typography } from 'antd';

import { PlusSquareOutlined as AddBoxIcon, DeleteOutlined as RemoveCircleIcon } from '@ant-design/icons';
import _ from "lodash";

const { Text } = Typography;

// const Input = styled("input")({ display: "none" });

const HiddenInput = styled(Input)`
display: none;
`;

const Box = styled.div`
  /* Custom styles */
`;

interface AttackFileFieldProps {
  label: string;
  values: any; // Assuming values is an array of File objects
  multiple?: boolean;
  required?: boolean;
  onChange: (newValues: File[]) => void;
  onSnackbar: (snackbar: { open: boolean; message: string }) => void;
}

const AttackFileField: FC<AttackFileFieldProps> = ({
  label,
  values,
  multiple = false,
  required = false,
  onChange,
  onSnackbar
}) => {
  
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return; // Check if files exist

    let newInputList = [...values];
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      if (file.type) {
        newInputList = [...newInputList, file];
      }
    }
    onChange(newInputList);
  };

  return (
    <Space>
      <Text>{label}</Text>
      <label htmlFor="contained-button-file">
        <HiddenInput
          accept="image/*"
          id="contained-button-file"
          name="file"
          multiple={multiple}
          type="file"
          onChange={onFileChange}
        />
        {/* <IconButton
          color="primary"
          aria-label="upload picture"
          component="span"
        >
          <AddBoxIcon />
        </IconButton> */}
        <Button icon={<AddBoxIcon />} shape="circle"/>
      </label>
      <Space direction="horizontal" size={2}>
        {_.map(
          _.filter(values, (v) => !v?.delete),
          (file, index) => {
            const isOldFile = file?.url;

            return (
              <Space style={{ position: "relative" }} key={index}>
                
                <Avatar style={{ 
                   height: 80,
                   width: 80,
                   border: "1px solid #cccccc",
                   padding: "5px",
                   marginBottom: "5px"
                  }} src={isOldFile ? file?.url : URL.createObjectURL(file)}></Avatar>
                {/* <IconButton
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0
                  }}
                  color="primary"
                  aria-label="delete picture"
                  component="span"
                  onClick={() => {
                    const newInputList = [...values];
                    const i = _.findIndex(newInputList, (v) => v._id === file._id);

                    if (isOldFile) {
                      if (i !== -1) {
                        newInputList[i] = {
                          ...newInputList[i],
                          delete: true
                        };
                      }
                    } else {
                      newInputList.splice(index, 1);
                    }

                    onChange(newInputList);
                    onSnackbar({ open: true, message: "Delete image" });
                  }}
                >
                  <RemoveCircleIcon />
                </IconButton> */}

                <Button 
                  icon={<RemoveCircleIcon /> } 
                  shape="circle"
                  onClick={() => {
                    const newInputList = [...values];
                    const i = _.findIndex(newInputList, (v) => v._id === file._id);

                    if (isOldFile) {
                      if (i !== -1) {
                        newInputList[i] = {
                          ...newInputList[i],
                          delete: true
                        };
                      }
                    } else {
                      newInputList.splice(index, 1);
                    }

                    onChange(newInputList);
                    onSnackbar({ open: true, message: "Delete image" });
                  }}/>
              </Space>
            );
          }
        )}
      </Space>
    </Space>
  );
};

export default AttackFileField;
