# Ledger
<p>Generate a ledger based on Credit and Debit data of a Client.</p>

<hr/>

<h3>Requirements</h3>
<ul>
  <li>Node.js</li>
  <li>Express.js</li>
  <li>EJS</li>
  <li>Mongo.js</li>
  <li>Underscore.js</li>
</ul>

<h3>Create a MongoDB instance</h3>
<p>Create three collections in the <b>'db_billing'</b> database you have created,</p>
<ul>
  <li>Invoices</li>
  <li>Payments</li>
  <li>Clients</li>
</ul>

<pre>
 <code>
 // This is how you create a collection, if using local machine db, else look at the mongo.js documentation
 // Run these commands separately
 db.createCollection("invoices")
 db.createCollection("payments")
 db.createCollection("clients")
 </code>
</pre>


<h4>Format of Invoice Data</h4>
<pre>
  <code>
    let invoice = {
            inv_no: 1,
            date: DD/MM/YYY,
            c_name: 'John Doe',
            item_code: 'PEN-001',
            item_desc: 'Blue Ink Pen from Parker',
            qty: 10,
            price: 200,
            total: 2000
     };
   </code>
</pre>

<h4>Format of Payment Data</h4>
<pre>
  <code>
    let payment = {
            pmt_no: 1,
            date: DD/MM/YYYY,
            client: 'John Doe',
            amount: 1500,
            cheque_no: 'XYZ76762319'
    };
   </code>
</pre>

<h4>Format of Client Data</h4>
<pre>
  <code>
    let clientData = {
            company: "John Doe",
            contact: '3333333222',
            address: 'St.# 1, Planet Earth's Best Place'
    }
   </code>
</pre>

<h5>Make sure, if inserting data manually into the db, the format should be the same, for example...</h5>
<pre>
  <code>
    db.invoices.insert({ "inv_no": 1, "date": "DD/MM/YYY", "c_name": 'John Doe', "item_code": 'PEN-001', "item_desc": 'Blue Ink Pen from Parker', "qty": 10, "price": 200, "total": 2000})
   </code>
</pre>


<hr/>

<h3>In the end, if still you feel you need guidance, feel free to contact me anytime.</h3>
