const axios = require('axios');
const { parseStringPromise } = require('xml2js');

const TALLY_URL = 'http://localhost:9000/';

async function getStockItems() {
    // Calculate dates: 365 days ago to today
    const today = new Date();
    const fromDate = new Date(today);
    fromDate.setDate(today.getDate() - 365);
    const formattedFromDate = fromDate.toISOString().slice(0, 10).replace(/-/g, '');
    const formattedToDate = today.toISOString().slice(0, 10).replace(/-/g, '');

    const xmlRequest = `<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Export Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <EXPORTDATA>
      <REQUESTDESC>
        <STATICVARIABLES>
          <SVFROMDATE>${formattedFromDate}</SVFROMDATE>
          <SVTODATE>${formattedToDate}</SVTODATE>
          
          <!-- Expand ALL levels in detailed format = Yes or No-->
          <EXPLODEALLLEVELS>No</EXPLODEALLLEVELS>

          <!-- Format = Detailed or Condensed -->
          <!-- Yes means Detailed -->
          <!-- No means Condensed -->
          <EXPLODEFLAG>YES</EXPLODEFLAG>

          <!-- Show ALL Accts (incl Empty A/cs) = Yes or No-->
          <DSPSHOWALLACCOUNTS>No</DSPSHOWALLACCOUNTS>

          <!-- Show Opening balances = Yes or No -->
          <DSPSHOWOPENING>Yes</DSPSHOWOPENING>
          
          <!-- Show goods inwards = Yes or No -->
          <DSPSHOWINWARDS>YES</DSPSHOWINWARDS>
          <!-- Show goods outwards = Yes or No-->
          <DSPSHOWOUTWARDS>YES</DSPSHOWOUTWARDS>
          <!-- Show Closing balances = Yes or No -->
          <DSPSHOWCLOSING>Yes</DSPSHOWCLOSING>

          <!--Method of Information = Grouped or Item-wise-->
          <!-- Yes means Grouped-->
          <!-- No means Item-wise -->
          <ISITEMWISE>Yes</ISITEMWISE>

        </STATICVARIABLES>
        <REPORTNAME>Stock Summary</REPORTNAME>
      </REQUESTDESC>
    </EXPORTDATA>
  </BODY>
</ENVELOPE>`;

    try {
        const res = await axios.post(TALLY_URL, xmlRequest, {
            headers: { 'Content-Type': 'text/xml' },
        });
        const parsed = await parseStringPromise(res.data);
        console.log('Parsed Tally response:', JSON.stringify(parsed, null, 2));
        return parsed;
    } catch (err) {
        return { error: err.message };
    }
}

module.exports = { getStockItems };
