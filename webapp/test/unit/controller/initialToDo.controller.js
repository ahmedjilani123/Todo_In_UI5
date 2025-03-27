/*global QUnit*/

sap.ui.define([
	"td/mastertodo/controller/initialToDo.controller"
], function (Controller) {
	"use strict";

	QUnit.module("initialToDo Controller");

	QUnit.test("I should test the initialToDo controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
