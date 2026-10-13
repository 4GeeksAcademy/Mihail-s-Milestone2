const sampleShipments = [
  { order: "TF-20481", brand: "Example brand A", destination: "Destination A", carrier: "Carrier A", warehouse: "Warehouse 1", status: "In transit", updated: "12 min ago" },
  { order: "TF-20479", brand: "Example brand B", destination: "Destination B", carrier: "Carrier B", warehouse: "Warehouse 2", status: "Needs handoff", updated: "28 min ago" },
  { order: "TF-20474", brand: "Example brand C", destination: "Destination C", carrier: "Carrier C", warehouse: "Warehouse 1", status: "In transit", updated: "46 min ago" },
  { order: "TF-20469", brand: "Example brand D", destination: "Destination D", carrier: "Carrier D", warehouse: "Warehouse 2", status: "Delivered", updated: "1 hr ago" },
];

const rows = document.querySelector("#shipmentRows");
const searchInput = document.querySelector("#searchInput");
const locationFilter = document.querySelector("#locationFilter");
const statusFilter = document.querySelector("#statusFilter");
const emptyState = document.querySelector("#emptyState");

function statusClass(status) {
  if (status === "In transit") return "transit";
  if (status === "Needs handoff") return "handoff";
  return "delivered";
}

function createCell(content, className = "") {
  const cell = document.createElement("td");
  if (className) cell.className = className;
  cell.textContent = content;
  return cell;
}

function renderShipments() {
  const query = searchInput.value.trim().toLowerCase();
  const visibleShipments = sampleShipments.filter((shipment) => {
    const searchableValues = [shipment.order, shipment.brand, shipment.destination, shipment.carrier];
    const matchesSearch = searchableValues.some((value) => value.toLowerCase().includes(query));
    const matchesLocation = locationFilter.value === "all" || shipment.warehouse === locationFilter.value;
    const matchesStatus = statusFilter.value === "all" || shipment.status === statusFilter.value;
    return matchesSearch && matchesLocation && matchesStatus;
  });

  rows.replaceChildren(...visibleShipments.map((shipment) => {
    const row = document.createElement("tr");
    const orderCell = document.createElement("td");
    const orderId = document.createElement("strong");
    orderId.textContent = shipment.order;
    orderCell.append(orderId, document.createElement("br"), document.createTextNode(shipment.brand));

    const statusCell = document.createElement("td");
    const status = document.createElement("span");
    status.className = `status ${statusClass(shipment.status)}`;
    status.textContent = shipment.status;
    statusCell.append(status);

    row.append(
      orderCell,
      createCell(shipment.destination),
      createCell(shipment.carrier),
      createCell(shipment.warehouse),
      statusCell,
      createCell(shipment.updated),
      createCell("···"),
    );
    return row;
  }));

  const transitCount = visibleShipments.filter((shipment) => shipment.status === "In transit").length;
  const handoffCount = visibleShipments.filter((shipment) => shipment.status === "Needs handoff").length;
  document.querySelector("#shipmentCount").textContent = String(visibleShipments.length).padStart(2, "0");
  document.querySelector("#transitCount").textContent = String(transitCount).padStart(2, "0");
  document.querySelector("#handoffCount").textContent = String(handoffCount).padStart(2, "0");
  document.querySelector("#resultSummary").textContent = `Showing ${visibleShipments.length} of ${sampleShipments.length} sample shipments`;
  emptyState.hidden = visibleShipments.length > 0;
}

function updateTimestamp() {
  document.querySelector("#updatedAt").textContent = new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

searchInput.addEventListener("input", renderShipments);
locationFilter.addEventListener("change", renderShipments);
statusFilter.addEventListener("change", renderShipments);
document.querySelector("#refreshButton").addEventListener("click", updateTimestamp);
document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    searchInput.focus();
  }
});

renderShipments();
updateTimestamp();