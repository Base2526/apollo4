import "@/pages/administrator/orgchart/index.css"

import React, { useState, useEffect } from 'react';
import OrgChart from '@somkid.sim/react-org-chart-ts'
import photo from '@/assets/logo512.png'
import { generateTreeData } from "@/pages/administrator/orgchart/faker"
import { Node, TreeNode } from "@/pages/administrator/orgchart/interface" 

let  confg = {}
const OrgChartPage: React.FC = () => {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  useEffect(()=>{
    // 1 top-level node, 2 children per node, 4 levels deep x
    setTreeData(generateTreeData(1, 7, 5));
  }, [])
 
  return  <div>
            <div className="zoom-buttons">
              <button
                className="btn btn-outline-primary zoom-button"
                id="zoom-in"
              >+</button>
              <button
                className="btn btn-outline-primary zoom-button"
                id="zoom-out"
              >-</button>
              <button
                className="btn btn-outline-primary zoom-button"
                id="reset-position"
              >R</button>
            </div>
            {treeData.length > 0 &&   
            <OrgChart 
              tree={treeData[0]}
              zoomInId= {"zoom-in"}
              zoomOutId= {"zoom-out"}
              resetPositionId= {"reset-position"}
              // minZoom={0.01}
              // lineType={'curve'}
              loadConfig={(d: any) => {
                return confg
              }}
              onConfigChange={(config: any) => {
                confg = config
              }}
              loadImage={(d : Node) => {
                return Promise.resolve(photo)
              }}
              loadParent={(d : Node) => {
                console.log("loadParent :", d)
                return []
              }}
              loadChildren={(d : Node) => {
                console.log("loadChildren :", d)
                return []
              }} 
              showDetail={(d : Node) => {
                console.log("showDetail :", d)
              }}
              />}
          </div>
};

export default OrgChartPage;