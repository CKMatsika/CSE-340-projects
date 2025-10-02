const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  // Normalize to array to avoid errors when data is undefined/null
  data = Array.isArray(data) ? data : []
  let grid = ""
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      const make = vehicle.inv_make || 'Unknown'
      const model = vehicle.inv_model || 'Vehicle'
      const thumb = vehicle.inv_thumbnail || '/images/placeholder.svg'
      const priceText = Number.isFinite(Number(vehicle.inv_price))
        ? new Intl.NumberFormat('en-US').format(Number(vehicle.inv_price))
        : 'N/A'

      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + make + ' '+ model 
      + ' details"><img src="' + thumb 
      +'" alt="Image of '+ make + ' ' + model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + make + ' ' + model + ' details">' 
      + make + ' ' + model + '</a>'
      grid += '</h2>'
      grid += '<span>$' + priceText + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the vehicle detail view HTML
* ************************************ */
Util.buildVehicleDetail = async function(vehicle){
  if (!vehicle) return ""
  // Format price and miles
  const price = Number.isFinite(Number(vehicle.inv_price))
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(vehicle.inv_price))
    : 'N/A'
  const miles = (vehicle.inv_miles !== undefined && vehicle.inv_miles !== null && Number.isFinite(Number(vehicle.inv_miles)))
    ? new Intl.NumberFormat('en-US').format(Number(vehicle.inv_miles))
    : ""

  const make = vehicle.inv_make || 'Unknown'
  const model = vehicle.inv_model || 'Vehicle'
  const img = vehicle.inv_image || '/images/placeholder.svg'

  let detail = '<div class="vehicle-detail">'
  detail +=   '<div class="vehicle-media">'
  detail +=     '<img src="' + img + '" alt="Image of ' + make + ' ' + model + '" />'
  detail +=   '</div>'
  detail +=   '<div class="vehicle-info">'
  detail +=     '<h2 class="vehicle-title">' + (vehicle.inv_year || '') + ' ' + make + ' ' + model + '</h2>'
  detail +=     '<p class="vehicle-price"><strong>Price:</strong> ' + price + '</p>'
  if (miles) {
    detail +=   '<p class="vehicle-miles"><strong>Mileage:</strong> ' + miles + ' miles</p>'
  }
  if (vehicle.inv_color) {
    detail +=   '<p class="vehicle-color"><strong>Color:</strong> ' + vehicle.inv_color + '</p>'
  }
  if (vehicle.classification_name) {
    detail +=   '<p class="vehicle-class"><strong>Classification:</strong> ' + vehicle.classification_name + '</p>'
  }
  if (vehicle.inv_description) {
    detail +=   '<p class="vehicle-description">' + vehicle.inv_description + '</p>'
  }
  detail +=   '</div>'
  detail += '</div>'
  return detail
}

/* **************************************
* Build the classification select list HTML
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
}
