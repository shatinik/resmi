module.exports = {
	roomsByEnumID: {
		Unit: "getByEnumID",
		tableTitle: "rooms",
		fields: {
			ids: "ids",
			fields: "fields"
		},
		requiredFields: ["id"],
		availableFields: ["title", "photo", "views"],
		maxRowsToGet: 3
	}
}