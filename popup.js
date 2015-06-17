// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.insertCSS( {file: "fitnesse.css"});
  chrome.tabs.executeScript( { file: "fitnesse.js" });
  window.close();
});
