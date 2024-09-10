import React from 'react';
// import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Custom Checkbox component
// const Checkbox = ({ checked }) => (
//     <Text>{checked ? '[X]' : '[ ]'}</Text>
//   );
// const styles = StyleSheet.create({
//   page: {
//     flexDirection: 'column',
//     padding: 10,
//     fontSize: 12,
//   },
//   section: {
//     margin: 5,
//     padding: 5,
//     border: '1px solid black',
//   },
//   checkbox: {
//     width: 15,
//     height: 15,
//     marginRight: 5,
//   },
// });

interface SaleItem {
  id: number;
  name: string;
  amount: number;
  checked: boolean;
}

interface SaleReportProps {
  items: SaleItem[];
}

const SaleReport: React.FC<SaleReportProps> = ({ items }) => {
  return ( <></>
    // <Document>
    //   <Page style={styles.page}>
    //     <Text>Sale Report</Text>
    //     {items.map(item => (
    //       <View key={item.id} style={styles.section}>
    //         {/* <Checkbox style={styles.checkbox} checked={item.checked} /> */}
    //         <Text>
    //           {item.name}: ${item.amount}
    //         </Text>
    //       </View>
    //     ))}
    //   </Page>
    // </Document>
  );
};

export default SaleReport;
