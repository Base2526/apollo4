import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate, useLocation } from "react-router-dom";
import _ from "lodash"
import { useTranslation } from "react-i18next";

import { getHeaders } from "../util"
import { mutationTest_upload } from "../apollo/gqlQuery"
import AttackFileField from "../components/AttackFileField";

const FilePage = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [files, setFiles]         = useState([]);

  const [onMutationTest_upload, resultTest_upload] = useMutation(mutationTest_upload, {
    context: { headers: getHeaders(location) },
    update: (cache, {data: {test_upload}}) => {
      console.log("update :", test_upload)
    },
    onCompleted(data) {
      console.log("onCompleted :", data)
      window.location.reload();
    },
    onError(error){
      console.log("onError :", error)
    }
  });

  // useEffect(() => {
  //   if(!loadingFiles){
  //     if(!_.isEmpty(dataFiles?.files)){
  //       let { status, data } = dataFiles?.files
  //       console.log("Files :", dataFiles?.files)
  //       if(status) setServerData(data)
  //     }
  //   }
  // }, [dataFiles, loadingFiles])

  return (<div class="wrapper">
            <div>
              <AttackFileField
                label={t("attack_file")}
                values={files}
                multiple={true}
                required={true}
                onChange={(values) => {
                    setFiles(values)
                }}
                onSnackbar={(data) => {
                    // setSnackbar(data);
                }}/>
              <button disabled={ _.isEmpty(files) ? true : false } onClick={()=>{ 
                onMutationTest_upload({ variables: { input: { files } } });
               }}>Test upload</button>
            </div>
          </div>);
};

export default FilePage;