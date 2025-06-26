// Command Bar Modal Implementation
document.addEventListener('DOMContentLoaded', function() {
  // List of page commands (update as needed)
  const commands = [
    {
      name: 'Dashboard',
      href: 'dashboard.html',
      page: 'Dashboard',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M192-144v-456l288-216 288 216v456H552v-264H408v264H192Z"/></svg>',
      related: ['navigate', 'go to dashboard', 'home', 'main', 'overview', 'dash', 'main page']
    },
    {
      name: 'Add transaction',
      href: null,
      page: 'Dashboard',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M696-144h48v-72h72v-48h-72v-72h-48v72h-72v48h72v72Zm23.77 96Q640-48 584-104.23q-56-56.22-56-136Q528-320 584.23-376q56.22-56 136-56Q800-432 856-375.77q56 56.22 56 136Q912-160 855.77-104q-56.22 56-136 56ZM288-600h384v-72H288v72Zm185 456H216q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h528q29.7 0 50.85 21.15Q816-773.7 816-744v258q-23.73-8-47.86-12-24.14-4-48.14-4-12 0-24 1t-24 3v-18H288v72h266q-22 17-40 38t-31 46H288v72h170q-2 12-3 24t0 24q1 23 5.5 48.5T473-144Z"/></svg>',
      related: ['new transaction', 'create transaction', 'add expense', 'add income', 'add payment', 'add purchase', 'add spending', 'add earning', 'add money', 'add cash', 'add deposit', 'add withdrawal']
    },
    {
      name: 'Quick transaction',
      href: null,
      page: 'Dashboard',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="m288-96 144-288-288-48 456-432h72L528-576l288 48L360-96h-72Z"/></svg>',
      related: ['fast transaction', 'quick add', 'quick entry', 'quick expense', 'quick income', 'rapid transaction', 'instant transaction', 'speedy transaction']
    },
    {
      name: 'Speak transaction',
      href: null,
      page: 'Dashboard',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="m760-353-46-57q37-31 57.5-74t20.5-91q0-48-20.5-91T714-740l46-56q49 42 76.5 99.5T864-575q0 64-28 122t-76 100Zm-92-112-46-55q13-10 19.5-24.5T648-575q0-16-6.5-30T622-629l46-56q25 20 38.5 49t13.5 61q0 32-13.5 61T668-465Zm-284 33q-60 0-102-42t-42-102q0-60 42-102t102-42q60 0 102 42t42 102q0 60-42 102t-102 42ZM96-144v-97q0-24 13-44t34-33q55-33 116-50t125-17q64 0 125 17t116 50q20 13 33.5 33t13.5 44v97H96Z"/></svg>',
      related: ['voice transaction', 'voice add', 'voice entry', 'speech transaction', 'talk transaction', 'mic transaction', 'audio transaction', 'dictate transaction']
    },
    {
      name: 'Scan receipt',
      href: null,
      page: 'Dashboard',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M144-96v-768l56 45 56-45 56 45 56-45 56 45 56-45 56 45 56-45 56 45 56-45 56 45 56-45v768l-56-45-56 45-56-45-56 45-56-45-56 45-56-45-56 45-56-45-56 45-56-45-56 45Zm144-216h384v-72H288v72Zm0-132h384v-72H288v72Zm0-132h384v-72H288v72Z"/></svg>',
      related: ['camera receipt', 'photo receipt', 'picture receipt', 'upload receipt', 'receipt scan', 'receipt photo', 'receipt camera', 'receipt upload', 'scan bill', 'scan invoice']
    },
    {
      name: 'Import transactions',
      href: null,
      page: 'Dashboard',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M444-336v-342L339-573l-51-51 192-192 192 192-51 51-105-105v342h-72ZM263.72-192Q234-192 213-213.15T192-264v-72h72v72h432v-72h72v72q0 29.7-21.16 50.85Q725.68-192 695.96-192H263.72Z"/></svg>',
      related: ['upload transactions', 'load transactions', 'bring in transactions', 'sync transactions', 'import data', 'import csv', 'import file', 'upload file', 'load data']
    },
    {
      name: 'Export transactions',
      href: null,
      page: 'Dashboard',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M480-336 288-528l51-51 105 105v-342h72v342l105-105 51 51-192 192ZM263.72-192Q234-192 213-213.15T192-264v-72h72v72h432v-72h72v72q0 29.7-21.16 50.85Q725.68-192 695.96-192H263.72Z"/></svg>',
      related: ['download transactions', 'save transactions', 'backup transactions', 'export data', 'export csv', 'export file', 'download data', 'save data', 'backup data']
    },
    {
      name: 'Add preset',
      href: null,
      page: 'Dashboard',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M720-600v-72h-72v-72h72v-72h72v72h72v72h-72v72h-72ZM240-336h300v-108H240v108Zm0-180h300v-108H240v108Zm-72 324q-29.7 0-50.85-21.16Q96-234.32 96-264.04v-432.24Q96-726 117.15-747T168-768h418q-5 14-7.5 29.16t-2.5 30.69q0 25.15 6.5 47.65T600-618v282h120v-196q9.31 2 18.16 3 8.84 1 17.84 1 31 0 58-9.5t50-26.5v300q0 29.7-21.15 50.85Q821.7-192 792-192H168Z"/></svg>',
      related: ['new preset', 'create preset', 'add template', 'new template', 'create template', 'add recurring', 'new recurring', 'create recurring', 'add scheduled', 'new scheduled']
    },
    {
      name: 'Quick preset',
      href: null,
      page: 'Dashboard',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="m336-96 48-264H192l324-504h72l-36 312h216L408-96h-72Z"/></svg>',
      related: ['fast preset', 'quick template', 'fast template', 'quick recurring', 'fast recurring', 'quick scheduled', 'fast scheduled', 'instant preset', 'rapid preset']
    },
    {
      name: 'Speak preset',
      href: null,
      page: 'Dashboard',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M240-504h48v-96h-48v96Zm96 72h48v-240h-48v240Zm120 72h48v-384h-48v384Zm120-72h48v-240h-48v240Zm96-72h48v-96h-48v96ZM96-96v-696q0-29.7 21.15-50.85Q138.3-864 168-864h624q29.7 0 50.85 21.15Q864-821.7 864-792v480q0 29.7-21.15 50.85Q821.7-240 792-240H240L96-96Z"/></svg>',
      related: ['voice preset', 'voice template', 'speech preset', 'talk preset', 'mic preset', 'audio preset', 'dictate preset', 'voice recurring']
    },
    {
      name: 'Search transactions',
      href: null,
      page: 'Dashboard',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M672-192q39 0 67.5-28t28.5-68q0-39-28.5-67.5T672-384q-32 0-64 24.5T576-288q0 40 28 68t68 28ZM861-48l-99-98q-20 13-42.5 19.5T672-120q-70 0-119-49t-49-119q0-69 49-118.5T672-456q69 0 118.5 49.5T840-288q0 26-7 48.5T813-197l99 99-51 50ZM216-96q-30 0-51-21t-21-51v-624q0-30 21-51t51-21h312l192 192v149q-12-2-24-3.5t-24-1.5q-51 0-95 19.5T500-456H288v72h164q-8 17-12.5 35t-6.5 37H288v72h149q8 43 31.5 80.5T527-96H216Zm264-528h168L480-792l168 168-168-168v168Z"/></svg>',
      related: ['find transactions', 'lookup transactions', 'filter transactions', 'browse transactions', 'query transactions', 'search expenses', 'search income', 'find expenses', 'find income']
    },
    {
      name: 'AI search transactions',
      href: null,
      page: 'Dashboard',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M492-337q69 0 118.5-45T660-489.94q0-56.06-36.5-95.56T535.95-625q-46.14 0-78.04 30Q426-565 426-523q0 20 7.24 36.94Q440.48-469.12 454-455l51-51q-3.5-3-5.25-7.5t-1.75-9.03Q498-535 509-544q11-9 27-9 21 0 36.5 18.56T588-490q0 33-28.5 57t-67.26 24q-49.24 0-84.74-41.5Q372-492 372-549q0-30.77 11.5-58.88Q395-636 417-658l-51-50q-32 32-49 73t-17 86q0 88 56 150t136 62ZM264-96v-175q-57-48-88.5-115.57T144-529q0-139.58 98.29-237.29Q340.58-864 481-864q109 0 196 58.5T792-653l66 223q5 17.48-5.5 31.74Q842-384 824-384h-56v120q0 29.7-21.15 50.85Q725.7-192 696-192h-96v96H264Z"/></svg>',
      related: ['smart search', 'ai find', 'ai lookup', 'ai filter', 'ai browse', 'ai query', 'smart find', 'smart lookup', 'smart filter', 'intelligent search', 'ai search', 'smart search transactions']
    },
    {
      name: 'Sort by Default',
      href: null,
      page: 'Dashboard',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>',
      related: ['default sort', 'normal sort', 'regular sort', 'standard sort', 'original sort', 'reset sort', 'clear sort']
    },
    {
      name: 'Sort by Date: Oldest First',
      href: null,
      page: 'Dashboard',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Z"/></svg>',
      related: ['date ascending', 'oldest date', 'earliest first', 'date old to new', 'chronological', 'ascending date', 'date asc']
    },
    {
      name: 'Sort by Date: Newest First',
      href: null,
      page: 'Dashboard',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Z"/></svg>',
      related: ['date descending', 'newest date', 'latest first', 'date new to old', 'reverse chronological', 'descending date', 'date desc', 'recent first']
    },
    {
      name: 'Sort by Amount: Low to High',
      href: null,
      page: 'Dashboard',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M444-200h70v-50q50-9 86-39t36-89q0-42-24-77t-96-61q-60-20-83-35t-23-41q0-26 18.5-41t53.5-15q32 0 50 15.5t26 38.5l64-26q-11-35-40.5-61T516-710v-50h-70v50q-50 11-78 44t-28 74q0 47 27.5 76t86.5 50q63 23 87.5 41t24.5 47q0 33-23.5 48.5T486-314q-33 0-58.5-20.5T390-396l-66 26q14 48 43.5 77.5T444-252v52Zm36 120q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>',
      related: ['amount ascending', 'smallest first', 'lowest amount', 'cheapest first', 'amount asc', 'ascending amount', 'small to large']
    },
    {
      name: 'Sort by Amount: High to Low',
      href: null,
      page: 'Dashboard',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M444-200h70v-50q50-9 86-39t36-89q0-42-24-77t-96-61q-60-20-83-35t-23-41q0-26 18.5-41t53.5-15q32 0 50 15.5t26 38.5l64-26q-11-35-40.5-61T516-710v-50h-70v50q-50 11-78 44t-28 74q0 47 27.5 76t86.5 50q63 23 87.5 41t24.5 47q0 33-23.5 48.5T486-314q-33 0-58.5-20.5T390-396l-66 26q14 48 43.5 77.5T444-252v52Zm36 120q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>',
      related: ['amount descending', 'largest first', 'highest amount', 'most expensive first', 'amount desc', 'descending amount', 'large to small', 'biggest first']
    },
    {
      name: 'Add date filter',
      href: null,
      page: 'Dashboard',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M576.23-240Q536-240 508-267.77q-28-27.78-28-68Q480-376 507.77-404q27.78-28 68-28Q616-432 644-404.23q28 27.78 28 68Q672-296 644.23-268q-27.78 28-68 28ZM216-96q-29.7 0-50.85-21.5Q144-139 144-168v-528q0-29 21.15-50.5T216-768h72v-96h72v96h240v-96h72v96h72q29.7 0 50.85 21.5Q816-725 816-696v528q0 29-21.15 50.5T744-96H216Zm0-72h528v-360H216v360Z"/></svg>',
      related: ['filter by date', 'date range', 'time filter', 'period filter', 'date range filter', 'time period', 'date selection', 'calendar filter']
    },
    {
      name: 'Add type filter',
      href: null,
      page: 'Dashboard',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="m276-528 204-336 204 336H276ZM696-96q-70 0-119-49t-49-119q0-69 49-118.5T696-432q69 0 118.5 49.5T864-264q0 70-49.5 119T696-96Zm-552-24v-288h288v288H144Z"/></svg>',
      related: ['filter by type', 'category filter', 'transaction type', 'expense income filter', 'category selection', 'type selection', 'filter category']
    },
    {
      name: 'Add amount filter',
      href: null,
      page: 'Dashboard',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M469-312h32v-34q30-5 50-23.5t20-50.5q0-32-21.5-48T501-497v-78q10 3 17.31 10.58 7.32 7.59 10.69 18.42l37-16q-8-23-25-35t-40-17v-34h-32v32.58q-29.25 3.15-49.63 21.55Q399-575.48 399-545q0 31 22.5 48.5t48.5 28.99V-385q-17-5-28-17.5T426-432l-37 15.7q8 29.3 28.87 48.31 20.87 19.02 51.13 23.24V-312Zm32-74v-69q11 5 20 14t9 20.67q0 13.33-8.5 22.33-8.5 9-20.5 12Zm-32-124q-11.38-5.79-20.69-13.89Q439-532 439-544.5t9-21q9-8.5 21-10.5v66ZM336-192q-120.34 0-204.17-83.76Q48-359.52 48-479.76T131.83-684q83.83-84 204.17-84h288q120.34 0 204.17 83.76 83.83 83.76 83.83 204T828.17-276Q744.34-192 624-192H336Z"/></svg>',
      related: ['filter by amount', 'price filter', 'cost filter', 'money filter', 'amount range', 'price range', 'cost range', 'money range', 'amount selection']
    },
    {
      name: 'Add store/source filter',
      href: null,
      page: 'Dashboard',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M288-240h144v-48h-96v-24h96v-120H288v48h96v24h-96v120Zm336 0h48v-192h-48v96h-48v-96h-48v144h96v48Zm192-264v287.64q0 29.85-21.15 51.1Q773.7-144 744-144H216q-29.7 0-50.85-21.5Q144-187 144-216v-289q-33-23-41.5-59t.5-76l46-128q5-24 23-36t43.67-12h528.66q25.67 0 43.17 11t23.5 37l46 128q9 40 0 76t-41 60Zm-248-48q21 0 35.5-14t12.5-34l-24-144h-72v143.62Q520-580 534-566q14 14 34 14Zm-176.5 0q20.5 0 34.5-14t14-34.38V-744h-72l-24 144q-2 20 12.5 34t35 14ZM216-552q18 0 31.5-11t15.5-28l25-153h-72l-45 128q-8 23 6 43.5t39 20.5Zm528 0q25 0 39.5-20.5T790-616l-46-128h-72l25 153q2 17 16 28t31 11Z"/></svg>',
      related: ['filter by store', 'filter by source', 'merchant filter', 'vendor filter', 'business filter', 'company filter', 'store selection', 'source selection', 'merchant selection']
    },
    {
      name: 'Add method filter',
      href: null,
      page: 'Dashboard',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M240-192q-60 0-102-42T96-336v-288q0-60 42-102t102-42h480q60 0 102 42t42 102v288q0 60-42 102t-102 42H240Zm0-432h480q19 0 37 5.5t35 14.5v-20q0-30-21-51t-51-21H240q-30 0-51 21t-21 51v20q17-10 35-15t37-5Zm-63 110 430 105q8 2 16 0t15-7l135-112q-11-11-24.5-17.5T720-552H240q-20 0-38 11t-25 27Z"/></svg>',
      related: ['filter by method', 'payment method filter', 'payment type filter', 'card filter', 'cash filter', 'bank filter', 'method selection', 'payment selection']
    },
    {
      name: 'Reminders',
      href: 'reminders.html',
      page: 'Reminders',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M288-384v-72h384v72H288Zm0 144v-72h288v72H288ZM216-96q-29.7 0-50.85-21.5Q144-139 144-168v-528q0-29 21.15-50.5T216-768h72v-96h72v96h240v-96h72v96h72q29.7 0 50.85 21.5Q816-725 816-696v528q0 29-21.15 50.5T744-96H216Zm0-72h528v-360H216v360Z"/></svg>',
      related: ['navigate', 'go to reminders', 'reminder', 'alerts', 'notifications', 'todo', 'tasks', 'scheduled', 'due dates', 'remind me', 'reminder list']
    },
    {
      name: 'Add reminder',
      href: null,
      page: 'Reminders',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M684-96v-108H576v-72h108v-108h72v108h108v72H756v108h-72Zm-468-96q-29 1-50.5-21T144-264v-432q0-29.7 21.5-50.85Q187-768 216-768h48v-96h72v96h192v-96h72v96h48q29 0 51 21t21 51v216q-18 0-36 3t-36 9v-60H216v264h266q-2 17-1.5 35t4.5 37H216Z"/></svg>',
      related: ['new reminder', 'create reminder', 'add alert', 'new alert', 'create alert', 'add todo', 'new todo', 'create todo', 'add task', 'new task', 'create task', 'schedule reminder']
    },
    {
      name: 'Search reminders',
      href: null,
      page: 'Reminders',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M96-216v-72h384v72H96Zm0-180v-72h192v72H96Zm0-180v-72h192v72H96Zm717 360L660-369q-23 16-50.5 24.5T552-336q-79.68 0-135.84-56.23-56.16-56.22-56.16-136Q360-608 416.23-664q56.22-56 136-56Q632-720 688-663.84q56 56.16 56 135.84 0 30-8.5 57.5T711-420l153 153-51 51ZM552-408q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Z"/></svg>',
      related: ['find reminders', 'lookup reminders', 'filter reminders', 'browse reminders', 'query reminders', 'search alerts', 'find alerts', 'search todos', 'find todos']
    },
    {
      name: 'Summary',
      href: 'summary.html',
      page: 'Summary',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M640-160v-280h160v280H640Zm-240 0v-640h160v640H400Zm-240 0v-440h160v440H160Z"/></svg>',
      related: ['navigate', 'go to summary', 'reports', 'analytics', 'insights', 'overview', 'statistics', 'charts', 'graphs', 'financial summary', 'spending summary', 'income summary', 'budget summary']
    },
    {
      name: 'Summarize this week',
      href: null,
      page: 'Summary',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h560q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-560H200v560Zm80-80h400v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm-80 400v-560 560Z"/></svg>',
      related: ['weekly summary', 'this week', 'week report', 'weekly report', 'week overview', 'weekly overview', 'week stats', 'weekly stats', 'week analytics', 'weekly analytics']
    },
    {
      name: 'Summarize this month',
      href: null,
      page: 'Summary',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h560q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-560H200v560Zm80-80h400v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm-80 400v-560 560Z"/></svg>',
      related: ['monthly summary', 'this month', 'month report', 'monthly report', 'month overview', 'monthly overview', 'month stats', 'monthly stats', 'month analytics', 'monthly analytics']
    },
    {
      name: 'Summarize this year',
      href: null,
      page: 'Summary',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h560q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-560H200v560Zm80-80h400v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm-80 400v-560 560Z"/></svg>',
      related: ['yearly summary', 'this year', 'year report', 'yearly report', 'year overview', 'yearly overview', 'year stats', 'yearly stats', 'year analytics', 'yearly analytics', 'annual summary', 'annual report']
    },
    {
      name: 'Export summary as image',
      href: null,
      page: 'Summary',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M216-144q-30 0-51-21.5T144-216v-528q0-29 21-50.5t51-21.5h528q30 0 51 21.5t21 50.5v528q0 29-21 50.5T744-144H216Zm48-144h432L552-480 444-336l-72-96-108 144Z"/></svg>',
      related: ['save summary as image', 'download summary image', 'export chart', 'save chart', 'download chart', 'export graph', 'save graph', 'download graph', 'export picture', 'save picture']
    },
    {
      name: 'Export summary to email',
      href: null,
      page: 'Summary',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M168-192q-29 0-50.5-21.5T96-264v-432q0-29 21.5-50.5T168-768h624q30 0 51 21.5t21 50.5v432q0 29-21 50.5T792-192H168Zm312-240 312-179v-85L480-517 168-696v85l312 179Z"/></svg>',
      related: ['send summary email', 'email summary', 'mail summary', 'send report email', 'email report', 'mail report', 'send summary', 'email summary report', 'mail summary report']
    },
    {
      name: 'Plan',
      href: 'plan.html',
      page: 'Plan',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M635.79-528q15.21 0 25.71-10.29t10.5-25.5q0-15.21-10.29-25.71t-25.5-10.5q-15.21 0-25.71 10.29t-10.5 25.5q0 15.21 10.29 25.71t25.5 10.5ZM336-600h192v-72H336v72ZM192-144q-32-124-64-227T96-576q0-90.33 62.84-153.16Q221.67-792 312-792h199q30-35 72-53.5t89-18.5q20 0 34 14t14 34q0 6-8 32-5 10-9.5 19.5T696-744l96 96h72v264l-108 24-60 216H480v-72h-72v72H192Z"/></svg>',
      related: ['navigate', 'go to plan', 'budget', 'planning', 'financial plan', 'budget plan', 'money plan', 'spending plan', 'savings plan', 'financial planning', 'budget planning', 'money planning']
    },
    {
      name: 'Edit monthly budget',
      href: null,
      page: 'Plan',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M479.75-324q-34.75 0-59.25-24.75t-24.5-59.5q0-34.75 24.75-59.25t59.5-24.5q34.75 0 59.25 24.75t24.5 59.5q0 34.75-24.75 59.25t-59.5 24.5ZM306-672h348l60-144H246l60 144Zm43 528h262q85.42 0 145.21-60Q816-264 816-348.65q0-35.35-11.44-68.5T772-477l-98.16-123H285l-97 123q-21.12 26.71-32.56 59.86Q144-383.99 144-349q0 85 60 145t145 60Z"/></svg>',
      related: ['change budget', 'update budget', 'modify budget', 'set budget', 'adjust budget', 'new budget', 'create budget', 'monthly spending limit', 'monthly limit', 'budget limit']
    },
    {
      name: 'Edit monthly goal',
      href: null,
      page: 'Plan',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M192-96v-720h600L672-624l120 192H264v336h-72Z"/></svg>',
      related: ['change goal', 'update goal', 'modify goal', 'set goal', 'adjust goal', 'new goal', 'create goal', 'monthly target', 'monthly objective', 'savings goal', 'financial goal']
    },
    {
      name: 'Simulate what-if spending',
      href: null,
      page: 'Plan',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M624-209v-72h117L529-492 377-340 96-621l51-51 230 230 152-152 263 262v-117h72v240H624Z"/></svg>',
      related: ['test what-if spending', 'test scenarios', 'try what-if spending', 'try scenarios']
    },
    {
      name: 'Simulate what-if earnings',
      href: null,
      page: 'Plan',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="m147-209-51-51 281-281 152 152 212-211H624v-72h240v240h-72v-117L529-287 377-439 147-209Z"/></svg>',
      related: ['test what-if earnings', 'test scenarios', 'try what-if earnings', 'try scenarios']
    },
    {
      name: 'Score',
      href: 'score.html',
      page: 'Score',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M303.69-144q-34.69 0-64.19-15T182-205q-40.94-45.32-63.97-108.11T95-442q0-77.2 30.5-145.1Q156-655 208.5-706t122.46-80.5q69.96-29.5 149.5-29.5t149.04 30q69.5 30 122 82T834-582.5q30 69.5 30 148.3 0 71.38-24.4 133.49-24.39 62.11-69.28 104.75Q743-170 713.94-157q-29.06 13-59.06 13-16.88 0-34.88-4.5-18-4.5-35-12.5l-57-28q-11-5-21.5-7.5T483-199q-15 0-30.23 3.5T424-185l-49 24q-17 8-35 12.5t-36.31 4.5Zm176.52-228Q510-372 531-393.15T552-444q0-8-1.75-16T545-476l53-69q12 14 19.88 30.08Q625.75-498.85 631-480h73q-14-84-77.19-138T480-672q-85 0-148 54.5T256-480h72.6q12.4-53 54.97-86.5t96.04-33.5q16.83 0 31.68 3 14.85 3 28.71 9l-54.85 72H480.2q-29.79 0-50.99 21.21-21.21 21.21-21.21 51T429.21-393q21.21 21 51 21Z"/></svg>',
      related: ['rating', 'evaluation', 'go to score', 'navigate', 'fundify score']
    },
    {
      name: 'Explain my score',
      href: null,
      page: 'Score',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M444-288h72v-240h-72v240Zm35.79-312q15.21 0 25.71-10.29t10.5-25.5q0-15.21-10.29-25.71t-25.5-10.5q-15.21 0-25.71 10.29t-10.5 25.5q0 15.21 10.29 25.71t25.5 10.5Zm.49 504Q401-96 331-126t-122.5-82.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.96-834q69.96-30 149.5-30t149.04 30q69.5 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5Q699-156 629.28-126q-69.73 30-149 30Z"/></svg>',
      related: ['justify my score', 'justify score', 'justification', 'provide explanation', 'explanation', 'explain with ai']
    },
    {
      name: 'FundAI',
      href: 'fundAI.html',
      page: 'FundAI',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M192-384q-40 0-68-28t-28-68q0-40 28-68t68-28v-72q0-29.7 21.15-50.85Q234.3-720 264-720h120q0-40 28-68t68-28q40 0 68 28t28 68h120q29.7 0 50.85 21.15Q768-677.7 768-648v72q40 0 68 28t28 68q0 40-28 68t-68 28v168q0 29.7-21.16 50.85Q725.68-144 695.96-144H263.72Q234-144 213-165.15T192-216v-168Zm168-72q20 0 34-14t14-34q0-20-14-34t-34-14q-20 0-34 14t-14 34q0 20 14 34t34 14Zm228 0q20 0 34-14t14-34q0-20-14-34t-34-14q-20 0-34 14t-14 34q0 20 14 34t34 14ZM336-312h288v-72H336v72Z"/></svg>',
      related: ['navigate', 'go to fundai', 'ai chatbot', 'ai assistant', 'ai buddy', 'ai companion']
    },
    {
      name: 'Ask FundAI',
      href: null,
      page: 'FundAI',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M264-96v-175q-57-48-88.5-115.57T144-529q0-139.58 98.29-237.29Q340.58-864 481-864q109 0 196 58.5T792-653l66 223q5 17.48-5.5 31.74Q842-384 824-384h-56v120q0 29.7-21.15 50.85Q725.7-192 696-192h-96v96H264Zm74.14-302q26.14 26 64 26t63.93-26.12l143.86-144.11Q636-568.34 636-606.17T609.86-670q-26.14-26-64-26T482-670q-32-11-63.5-6.5T361-646q-25 25-30 56.5t7 63.5q-26 26.18-26 64.09Q312-424 338.14-398Z"/></svg>',
      related: ['ask chatbot', 'ask ai', 'ask assistant', 'ask buddy', 'ask companion', 'tell fundai', 'question fundai']
    },
    {
      name: 'Clear FundAI chat',
      href: null,
      page: 'FundAI',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm72-144h72v-336h-72v336Zm120 0h72v-336h-72v336Z"/></svg>',
      related: ['delete chat', 'remove chat', 'remove history', 'remove chat history', 'delete history', 'delete chat history']
    },
    {
      name: 'Help',
      href: 'help.html',
      page: 'Help',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M480-240q20 0 34-14t14-34q0-20-14-34t-34-14q-20 0-34 14t-14 34q0 20 14 34t34 14Zm-36-153h73q0-37 6.5-52.5T555-485q35-34 48.5-58t13.5-53q0-55-37.5-89.5T484-720q-51 0-88.5 27T343-620l65 27q9-28 28.5-43.5T482-652q28 0 46 16t18 42q0 23-15.5 41T496-518q-35 32-43.5 52.5T444-393Zm36 297q-79 0-149-30t-122.5-82.5Q156-261 126-331T96-480q0-80 30-149.5t82.5-122Q261-804 331-834t149-30q80 0 149.5 30t122 82.5Q804-699 834-629.5T864-480q0 79-30 149t-82.5 122.5Q699-156 629.5-126T480-96Z"/></svg>',
      related: ['navigate', 'faq', 'frequently asked questions', 'support', 'go to help']
    },
    {
      name: 'Ask for help',
      href: null,
      page: 'Help',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M432-144v-72h312v-267q0-110-76.78-187.5t-187-77.5Q370-748 293-670.5T216-483v227h-48q-29.7 0-50.85-21.74Q96-299.48 96-330v-74q0-23 13-41t35-23l3-51q9-63 38-117.5t73.5-94.5q44.5-40 101.49-62.5 56.99-22.5 120-22.5t119.81 22.56q56.81 22.55 101.5 62.5Q746-691 775-637t38 117l3 52q21 5 34.5 21.5T864-408v84q0 22-13.5 38.5T816-264v48q0 29.7-21.15 50.85Q773.7-144 744-144H432Zm-59.79-264q-15.21 0-25.71-10.29t-10.5-25.5q0-15.21 10.29-25.71t25.5-10.5q15.21 0 25.71 10.29t10.5 25.5q0 15.21-10.29 25.71t-25.5 10.5Zm216 0q-15.21 0-25.71-10.29t-10.5-25.5q0-15.21 10.29-25.71t25.5-10.5q15.21 0 25.71 10.29t10.5 25.5q0 15.21-10.29 25.71t-25.5 10.5ZM265-458q-9-97 55.7-167.5T482-696q82 0 142.5 55T694-504q-85 0-154.5-46.5T432-672q-14 71-57.5 127.5T265-458Z"/></svg>',
      related: ['ask ai', 'ask chatbot for help', 'ask ai for help', 'ask assistant for help']
    },
    {
      name: 'Settings',
      href: 'settings.html',
      page: 'Settings',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm112-260q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Z"/></svg>',
      related: ['navigate', 'go to settings', 'customize', 'options', 'customization']
    },
    {
      name: 'Account settings',
      href: null,
      page: 'Settings',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>',
      related: ['edit account', 'edit password', 'edit name', 'edit email', 'edit password', 'change details', 'edit details', 'email', 'name', 'password']
    },
    {
      name: 'Notification settings',
      href: null,
      page: 'Settings',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M192-216v-72h48v-240q0-87 53.5-153T432-763v-53q0-20 14-34t34-14q20 0 34 14t14 34v53q85 16 138.5 82T720-528v240h48v72H192ZM479.79-96Q450-96 429-117.15T408-168h144q0 30-21.21 51t-51 21Z"/></svg>',
      related: ['disable reminder notifications', 'reminder notifications']
    },
    {
      name: 'Security settings',
      href: null,
      page: 'Settings',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/></svg>',
      related: ['2fa', '2 step verification', '2-step verification', 'require password to view transactions', 'require password to see transactions', 'disable fundai access to reminders', "disable fundai's access to reminders", 'disable fundai access to transactions', "disable fundai's access to transactions"]
    },
  ];

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    .cmd-modal-bg {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(20, 20, 20, 0.65);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
      opacity: 0;
      transition: opacity 0.18s cubic-bezier(.4,0,.2,1);
    }
    .cmd-modal-bg.cmd-visible {
      opacity: 1;
    }
    .cmd-modal {
      background: var(--main-bg, #18191a);
      border-radius: 16px;
      border: 2px solid var(--card-bg, #23262a);
      box-shadow: 0 8px 32px rgba(0,0,0,0.25);
      min-width: 700px;
      max-width: 99vw;
      padding: 12px;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      position: relative;
      opacity: 0;
      transform: translateY(32px) scale(0.98);
      pointer-events: none;
      transition: opacity 0.18s cubic-bezier(.4,0,.2,1), transform 0.22s cubic-bezier(.4,0,.2,1);
    }
    .cmd-modal-bg.cmd-visible .cmd-modal {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }
    .cmd-modal input[type="text"], .cmd-modal input[type="number"] {
      background: var(--main-bg, #18191a);
      color: var(--text, #e3e3e3);
      border: none;
      outline: none;
      font-size: 1.1rem;
      padding: 20px 16px;
      border-radius: 8px 8px 0 0;
      width: 100%;
      box-sizing: border-box;
      font-family: inherit;
      transition: background 0.18s;
    }
    .cmd-modal input[type="number"]::-webkit-outer-spin-button,
    .cmd-modal input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    .cmd-modal input[type="number"] {
      -moz-appearance: textfield;
    }
    .cmd-modal .cmd-close {
      position: absolute;
      right: 16px;
      top: 16px;
      background: none;
      border: none;
      color: var(--text-muted, #bfc6e0);
      font-size: 1.3rem;
      cursor: pointer;
      transition: color 0.15s;
    }
    .cmd-modal .cmd-close:hover {
      color: var(--text, #e3e3e3);
    }
    .cmd-list {
      margin-top: 8px;
      padding: 0 16px;
      max-height: 320px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 8px;
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE 10+ */
    }
    .cmd-list::-webkit-scrollbar {
      display: none; /* Chrome/Safari/Webkit */
    }
    .cmd-item {
      background: var(--main-bg, #18191a);
      color: var(--text, #e3e3e3);
      border-radius: 8px;
      padding: 16px;
      font-size: 1.05rem;
      cursor: pointer;
      transition: background 0.18s cubic-bezier(.4,0,.2,1), color 0.15s, transform 0.18s cubic-bezier(.4,0,.2,1);
      outline: none;
      border: none;
      text-align: left;
      width: 100%;
      font-family: inherit;
      display: flex;
      align-items: center;
      will-change: background, color, transform;
    }
    .cmd-item.selected, .cmd-item:focus {
      background: var(--sidebar-bg, #000000);
      color: var(--accent, #235FD6);
      transform: scale(1.03);
      z-index: 1;
    }
    .cmd-item.selected svg, .cmd-item:focus svg {
      fill: var(--accent, #235FD6);
    }
    .cmd-item.selected .cmd-page-label, .cmd-item:focus .cmd-page-label {
      color: var(--accent, #235FD6) !important;
      opacity: 1 !important;
    }
    .cmd-separator {
      width: 100%;
      height: 2px;
      background: var(--card-bg, #23262a);
      opacity: 0.7;
      margin: 0 0 8px 0;
      border-radius: 1px;
    }
    .cmd-icon {
      margin-right: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      flex-shrink: 0;
    }
    @media (max-width: 600px) {
      .cmd-modal { min-width: 90vw; }
    }
  `;
  document.head.appendChild(style);

  // Create modal elements
  const modalBg = document.createElement('div');
  modalBg.className = 'cmd-modal-bg';
  modalBg.style.display = 'none';

  const modal = document.createElement('div');
  modal.className = 'cmd-modal';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Search commands...';
  input.setAttribute('aria-label', 'Command search');

  // Separator line
  const separator = document.createElement('div');
  separator.className = 'cmd-separator';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'cmd-close';
  closeBtn.innerHTML = '&times;';
  closeBtn.title = 'Close (Esc)';

  const list = document.createElement('div');
  list.className = 'cmd-list';

  modal.appendChild(input);
  modal.appendChild(separator);
  modal.appendChild(closeBtn);
  modal.appendChild(list);
  modalBg.appendChild(modal);
  document.body.appendChild(modalBg);

  let filtered = [...commands];
  let selectedIdx = 0;
  let promptMode = false;
  let promptCallback = null;

  function renderList() {
    list.innerHTML = '';
    if (promptMode) {
      list.style.display = 'none';
      return;
    } else {
      list.style.display = '';
    }
    filtered.forEach((cmd, i) => {
      const item = document.createElement('button');
      item.className = 'cmd-item' + (i === selectedIdx ? ' selected' : '');
      item.tabIndex = -1;
      item.style.display = 'flex';
      item.style.alignItems = 'center';
      item.style.gap = '6px';
      // SVG icon from command
      const iconContainer = document.createElement('span');
      iconContainer.className = 'cmd-icon';
      iconContainer.style.display = 'flex';
      iconContainer.style.alignItems = 'center';
      iconContainer.style.justifyContent = 'center';
      iconContainer.style.width = '22px';
      iconContainer.style.height = '22px';
      iconContainer.style.flexShrink = '0';
      iconContainer.innerHTML = cmd.icon || '';
      // Text node
      const textNode = document.createElement('span');
      textNode.textContent = cmd.name;
      textNode.style.flex = '1';
      textNode.style.textAlign = 'left';
      // Page name (if present)
      let pageNode = null;
      if (cmd.page) {
        pageNode = document.createElement('span');
        pageNode.className = 'cmd-page-label';
        pageNode.textContent = cmd.page;
        pageNode.style.marginLeft = 'auto';
        pageNode.style.fontSize = '0.85em';
        pageNode.style.color = '#bfc6e0';
        pageNode.style.opacity = '0.65';
        pageNode.style.fontWeight = '400';
        pageNode.style.letterSpacing = '0.01em';
        pageNode.style.whiteSpace = 'nowrap';
        pageNode.style.pointerEvents = 'none';
        pageNode.style.userSelect = 'none';
        pageNode.style.flexShrink = '0';
        pageNode.style.maxWidth = '160px';
        pageNode.style.overflow = 'hidden';
        pageNode.style.textOverflow = 'ellipsis';
        pageNode.style.textAlign = 'right';
      }
      item.appendChild(iconContainer);
      item.appendChild(textNode);
      if (pageNode) item.appendChild(pageNode);
      item.onclick = () => {
        if (cmd.name === 'Add reminder') {
          hideModal();
          setTimeout(() => {
            function openReminderModal() {
              const addBtn = document.getElementById('openAddModal');
              if (addBtn) addBtn.click();
            }
            if (!window.location.pathname.endsWith('reminders.html')) {
              window.location.href = 'reminders.html#add=reminder';
            } else {
              openReminderModal();
            }
          }, 100);
        } else if (cmd.name === 'Quick preset') {
          enterPromptMode('Describe your preset...', function(promptText) {
            hideModal();
            setTimeout(() => {
              function doQuickPreset() {
                const addModal = document.getElementById('openAddModal');
                if (addModal) addModal.click();
                setTimeout(() => {
                  const quickTabBtn = document.querySelector('.modal-tab-btn[data-content-id="quick-preset-content"]');
                  if (quickTabBtn) quickTabBtn.click();
                  setTimeout(() => {
                    const quickPrompt = document.querySelector('#quick-preset-content .quick-preset-prompt');
                    const quickAddBtn = document.querySelector('#quick-preset-content button[type="submit"]');
                    if (quickPrompt) quickPrompt.value = promptText;
                    if (quickAddBtn) quickAddBtn.click();
                  }, 100);
                }, 100);
              }
              if (!window.location.pathname.endsWith('dashboard.html')) {
                window.location.href = 'dashboard.html#quick-preset=' + encodeURIComponent(promptText);
              } else {
                doQuickPreset();
              }
            }, 100);
          });
        } else if (cmd.name === 'Scan receipt' || cmd.name === 'Import transactions' || cmd.name === 'Export transactions' || cmd.name === 'Add preset') {
          hideModal();
          setTimeout(() => {
            function openTab(tabId) {
              const addModal = document.getElementById('openAddModal');
              if (addModal) addModal.click();
              setTimeout(() => {
                const tabBtn = document.querySelector(`.modal-tab-btn[data-content-id="${tabId}"]`);
                if (tabBtn) tabBtn.click();
              }, 100);
            }
            let tabId = '';
            if (cmd.name === 'Scan receipt') tabId = 'receipt-scan-content';
            if (cmd.name === 'Import transactions') tabId = 'import-transactions-content';
            if (cmd.name === 'Export transactions') tabId = 'export-transactions-content';
            if (cmd.name === 'Add preset') tabId = 'add-preset-content';
            if (!window.location.pathname.endsWith('dashboard.html')) {
              window.location.href = `dashboard.html#tab=${tabId}`;
            } else {
              openTab(tabId);
            }
          }, 100);
        } else if (cmd.name === 'Quick transaction') {
          enterPromptMode('Describe your transaction...', function(promptText) {
            hideModal();
            setTimeout(() => {
              function doQuickTransaction() {
                const addModal = document.getElementById('openAddModal');
                if (addModal) addModal.click();
                setTimeout(() => {
                  const quickTabBtn = document.querySelector('.modal-tab-btn[data-content-id="quick-transaction-content"]');
                  if (quickTabBtn) quickTabBtn.click();
                  setTimeout(() => {
                    const quickPrompt = document.querySelector('#quick-transaction-content .quick-transaction-prompt');
                    const quickAddBtn = document.querySelector('#quick-transaction-content button[type="submit"]');
                    if (quickPrompt) quickPrompt.value = promptText;
                    if (quickAddBtn) quickAddBtn.click();
                  }, 100);
                }, 100);
              }
              if (!window.location.pathname.endsWith('dashboard.html')) {
                window.location.href = 'dashboard.html#quick-transaction=' + encodeURIComponent(promptText);
              } else {
                doQuickTransaction();
              }
            }, 100);
          });
        } else if (cmd.name === 'Add transaction') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('dashboard.html')) {
              window.location.href = 'dashboard.html#add=transaction';
            } else {
              const addModal = document.getElementById('openAddModal');
              if (addModal) addModal.click();
              // Ensure the 'Add Transaction' tab is active
              setTimeout(() => {
                const addTabBtn = document.querySelector('.modal-tab-btn[data-content-id="add-transaction-content"]');
                if (addTabBtn) addTabBtn.click();
              }, 50);
            }
          }, 100);
        } else if (cmd.name === 'Search transactions') {
          enterPromptMode('Enter search query...', function(query) {
            // Go to dashboard.html, set #search-input value, and trigger input event
            hideModal();
            setTimeout(() => {
              if (!window.location.pathname.endsWith('dashboard.html')) {
                window.location.href = 'dashboard.html#search=' + encodeURIComponent(query);
              } else {
                const searchInput = document.getElementById('search-input');
                if (searchInput) {
                  searchInput.value = query;
                  searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
              }
            }, 100);
          });
        } else if (cmd.name === 'AI search transactions') {
          enterPromptMode('Enter AI search query...', function(query) {
            hideModal();
            setTimeout(() => {
              if (!window.location.pathname.endsWith('dashboard.html')) {
                window.location.href = 'dashboard.html#search=' + encodeURIComponent(query) + '&ai=1';
              } else {
                const searchInput = document.getElementById('search-input');
                if (searchInput) {
                  searchInput.value = query;
                  searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                  // Simulate click on AI search button
                  const aiBtn = document.getElementById('ai-search-btn');
                  if (aiBtn) aiBtn.click();
                }
              }
            }, 100);
          });
        } else if (cmd.name === 'Search reminders') {
          enterPromptMode('Enter reminder search query...', function(query) {
            hideModal();
            setTimeout(() => {
              if (!window.location.pathname.endsWith('reminders.html')) {
                window.location.href = 'reminders.html#search=' + encodeURIComponent(query);
              } else {
                const searchInput = document.getElementById('reminder-search');
                if (searchInput) {
                  searchInput.value = query;
                  searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
              }
            }, 100);
          });
        } else if (cmd.name === 'Summarize this week') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('summary.html')) {
              window.location.href = 'summary.html#range=week';
            } else {
              const weekBtn = document.querySelector('.summary-toggle-btn[data-range="week"]');
              if (weekBtn) weekBtn.click();
            }
          }, 100);
        } else if (cmd.name === 'Summarize this month') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('summary.html')) {
              window.location.href = 'summary.html#range=month';
            } else {
              const monthBtn = document.querySelector('.summary-toggle-btn[data-range="month"]');
              if (monthBtn) monthBtn.click();
            }
          }, 100);
        } else if (cmd.name === 'Summarize this year') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('summary.html')) {
              window.location.href = 'summary.html#range=year';
            } else {
              const yearBtn = document.querySelector('.summary-toggle-btn[data-range="year"]');
              if (yearBtn) yearBtn.click();
            }
          }, 100);
        } else if (cmd.name === 'Export summary as image') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('summary.html')) {
              window.location.href = 'summary.html#export=image';
            } else {
              // Wait for summary content to load
              const waitForSummary = () => {
                const summaryContent = document.getElementById('summary-main-content');
                if (summaryContent && summaryContent.children.length > 0) {
                  const exportImageBtn = document.getElementById('export-image-btn');
                  if (exportImageBtn) exportImageBtn.click();
                } else {
                  setTimeout(waitForSummary, 100);
                }
              };
              waitForSummary();
            }
          }, 100);
        } else if (cmd.name === 'Export summary to email') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('summary.html')) {
              window.location.href = 'summary.html#export=email';
            } else {
              // Wait for summary content to load
              const waitForSummary = () => {
                const summaryContent = document.getElementById('summary-main-content');
                if (summaryContent && summaryContent.children.length > 0) {
                  const exportEmailBtn = document.getElementById('export-email-btn');
                  if (exportEmailBtn) exportEmailBtn.click();
                } else {
                  setTimeout(waitForSummary, 100);
                }
              };
              waitForSummary();
            }
          }, 100);
        } else if (cmd.name === 'Ask FundAI') {
          enterPromptMode('Ask FundAI anything...', function(query) {
            hideModal();
            setTimeout(() => {
              if (!window.location.pathname.endsWith('fundAI.html')) {
                window.location.href = 'fundAI.html#query=' + encodeURIComponent(query);
              } else {
                const chatInput = document.getElementById('chatInput');
                const sendButton = document.getElementById('sendButton');
                if (chatInput && sendButton) {
                  chatInput.value = query;
                  chatInput.dispatchEvent(new Event('input', { bubbles: true }));
                  sendButton.click();
                }
              }
            }, 100);
          });
        } else if (cmd.name === 'Edit monthly budget') {
          enterPromptMode('Enter monthly budget amount...', function(amount) {
            hideModal();
            setTimeout(() => {
              if (!window.location.pathname.endsWith('plan.html')) {
                window.location.href = 'plan.html#budget=' + encodeURIComponent(amount);
              } else {
                const budgetInput = document.getElementById('budget-input');
                const budgetForm = document.getElementById('budget-form');
                if (budgetInput && budgetForm) {
                  budgetInput.value = amount;
                  budgetForm.querySelector('button[type="submit"]').click();
                }
              }
            }, 100);
          });
        } else if (cmd.name === 'Edit monthly goal') {
          enterPromptMode('Enter monthly goal amount...', function(amount) {
            hideModal();
            setTimeout(() => {
              if (!window.location.pathname.endsWith('plan.html')) {
                window.location.href = 'plan.html#goal=' + encodeURIComponent(amount);
              } else {
                const goalInput = document.getElementById('goal-input');
                const goalForm = document.getElementById('goal-form');
                if (goalInput && goalForm) {
                  goalInput.value = amount;
                  goalForm.querySelector('button[type="submit"]').click();
                }
              }
            }, 100);
          });
        } else if (cmd.name === 'Sort by Default') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('dashboard.html')) {
              window.location.href = 'dashboard.html#sort=default';
            } else {
              const sortDropdown = document.getElementById('sort-selected');
              if (sortDropdown) {
                sortDropdown.textContent = 'Sort by Default';
                sortDropdown.dataset.value = 'default';
                // Trigger the sort function
                if (typeof sortTransactions === 'function') {
                  sortTransactions('default');
                }
              }
            }
          }, 100);
        } else if (cmd.name === 'Sort by Date: Oldest First') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('dashboard.html')) {
              window.location.href = 'dashboard.html#sort=date_asc';
            } else {
              const sortDropdown = document.getElementById('sort-selected');
              if (sortDropdown) {
                sortDropdown.textContent = 'Sort by Date: Oldest First';
                sortDropdown.dataset.value = 'date_asc';
                // Trigger the sort function
                if (typeof sortTransactions === 'function') {
                  sortTransactions('date_asc');
                }
              }
            }
          }, 100);
        } else if (cmd.name === 'Sort by Date: Newest First') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('dashboard.html')) {
              window.location.href = 'dashboard.html#sort=date_desc';
            } else {
              const sortDropdown = document.getElementById('sort-selected');
              if (sortDropdown) {
                sortDropdown.textContent = 'Sort by Date: Newest First';
                sortDropdown.dataset.value = 'date_desc';
                // Trigger the sort function
                if (typeof sortTransactions === 'function') {
                  sortTransactions('date_desc');
                }
              }
            }
          }, 100);
        } else if (cmd.name === 'Sort by Amount: Low to High') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('dashboard.html')) {
              window.location.href = 'dashboard.html#sort=amount_asc';
            } else {
              const sortDropdown = document.getElementById('sort-selected');
              if (sortDropdown) {
                sortDropdown.textContent = 'Sort by Amount: Low to High';
                sortDropdown.dataset.value = 'amount_asc';
                // Trigger the sort function
                if (typeof sortTransactions === 'function') {
                  sortTransactions('amount_asc');
                }
              }
            }
          }, 100);
        } else if (cmd.name === 'Sort by Amount: High to Low') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('dashboard.html')) {
              window.location.href = 'dashboard.html#sort=amount_desc';
            } else {
              const sortDropdown = document.getElementById('sort-selected');
              if (sortDropdown) {
                sortDropdown.textContent = 'Sort by Amount: High to Low';
                sortDropdown.dataset.value = 'amount_desc';
                // Trigger the sort function
                if (typeof sortTransactions === 'function') {
                  sortTransactions('amount_desc');
                }
              }
            }
          }, 100);
        } else if (cmd.name === 'Reminders') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('reminders.html')) {
              window.location.href = 'reminders.html';
            } else {
              const remindersBtn = document.getElementById('reminders-btn');
              if (remindersBtn) remindersBtn.click();
            }
          }, 100);
        } else if (cmd.name === 'Add reminder') {
          hideModal();
          setTimeout(() => {
            function openReminderModal() {
              const addBtn = document.getElementById('openAddModal');
              if (addBtn) addBtn.click();
            }
            if (!window.location.pathname.endsWith('reminders.html')) {
              window.location.href = 'reminders.html#add=reminder';
            } else {
              openReminderModal();
            }
          }, 100);
        } else if (cmd.name === 'Search reminders') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('reminders.html')) {
              window.location.href = 'reminders.html#search=' + encodeURIComponent(input.value);
            } else {
              const searchInput = document.getElementById('reminder-search');
              if (searchInput) {
                searchInput.value = input.value;
                searchInput.dispatchEvent(new Event('input', { bubbles: true }));
              }
            }
          }, 100);
        } else if (cmd.name === 'Summary') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('summary.html')) {
              window.location.href = 'summary.html';
            } else {
              const summaryBtn = document.getElementById('summary-btn');
              if (summaryBtn) summaryBtn.click();
            }
          }, 100);
        } else if (cmd.name === 'Summarize this week') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('summary.html')) {
              window.location.href = 'summary.html#range=week';
            } else {
              const weekBtn = document.querySelector('.summary-toggle-btn[data-range="week"]');
              if (weekBtn) weekBtn.click();
            }
          }, 100);
        } else if (cmd.name === 'Summarize this month') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('summary.html')) {
              window.location.href = 'summary.html#range=month';
            } else {
              const monthBtn = document.querySelector('.summary-toggle-btn[data-range="month"]');
              if (monthBtn) monthBtn.click();
            }
          }, 100);
        } else if (cmd.name === 'Summarize this year') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('summary.html')) {
              window.location.href = 'summary.html#range=year';
            } else {
              const yearBtn = document.querySelector('.summary-toggle-btn[data-range="year"]');
              if (yearBtn) yearBtn.click();
            }
          }, 100);
        } else if (cmd.name === 'Export summary as image') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('summary.html')) {
              window.location.href = 'summary.html#export=image';
            } else {
              // Wait for summary content to load
              const waitForSummary = () => {
                const summaryContent = document.getElementById('summary-main-content');
                if (summaryContent && summaryContent.children.length > 0) {
                  const exportImageBtn = document.getElementById('export-image-btn');
                  if (exportImageBtn) exportImageBtn.click();
                } else {
                  setTimeout(waitForSummary, 100);
                }
              };
              waitForSummary();
            }
          }, 100);
        } else if (cmd.name === 'Export summary to email') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('summary.html')) {
              window.location.href = 'summary.html#export=email';
            } else {
              // Wait for summary content to load
              const waitForSummary = () => {
                const summaryContent = document.getElementById('summary-main-content');
                if (summaryContent && summaryContent.children.length > 0) {
                  const exportEmailBtn = document.getElementById('export-email-btn');
                  if (exportEmailBtn) exportEmailBtn.click();
                } else {
                  setTimeout(waitForSummary, 100);
                }
              };
              waitForSummary();
            }
          }, 100);
        } else if (cmd.name === 'Plan') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('plan.html')) {
              window.location.href = 'plan.html';
            } else {
              const planBtn = document.getElementById('plan-btn');
              if (planBtn) planBtn.click();
            }
          }, 100);
        } else if (cmd.name === 'Edit monthly budget') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('plan.html')) {
              window.location.href = 'plan.html#edit-budget';
            } else {
              const budgetBtn = document.getElementById('budget-btn');
              if (budgetBtn) budgetBtn.click();
            }
          }, 100);
        } else if (cmd.name === 'Edit monthly goal') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('plan.html')) {
              window.location.href = 'plan.html#edit-goal';
            } else {
              const goalBtn = document.getElementById('goal-btn');
              if (goalBtn) goalBtn.click();
            }
          }, 100);
        } else if (cmd.name === 'Simulate what-if spending') {
          enterPromptMode('Enter daily spend (1-500)', function(val) {
            hideModal();
            setTimeout(() => {
              function setSpendSlider() {
                const spendSlider = document.getElementById('whatif-spend-slider');
                if (spendSlider) {
                  let num = parseFloat(val);
                  if (isNaN(num)) num = 1;
                  num = Math.max(1, Math.min(500, num));
                  spendSlider.value = num;
                  spendSlider.dispatchEvent(new Event('input', { bubbles: true }));
                  // Scroll the what-if widget into view
                  const whatIfWidget = document.getElementById('what-if-widget');
                  if (whatIfWidget) {
                    whatIfWidget.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }
              }
              if (!window.location.pathname.endsWith('plan.html')) {
                window.location.href = 'plan.html#whatif-spend=' + encodeURIComponent(val);
              } else {
                setSpendSlider();
              }
            }, 100);
          });
        } else if (cmd.name === 'Simulate what-if earnings') {
          enterPromptMode('Enter daily earn (1-500)', function(val) {
            hideModal();
            setTimeout(() => {
              function setEarnSlider() {
                const earnSlider = document.getElementById('whatif-earn-slider');
                if (earnSlider) {
                  let num = parseFloat(val);
                  if (isNaN(num)) num = 1;
                  num = Math.max(1, Math.min(500, num));
                  earnSlider.value = num;
                  earnSlider.dispatchEvent(new Event('input', { bubbles: true }));
                  // Scroll the what-if widget into view
                  const whatIfWidget = document.getElementById('what-if-widget');
                  if (whatIfWidget) {
                    whatIfWidget.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }
              }
              if (!window.location.pathname.endsWith('plan.html')) {
                window.location.href = 'plan.html#whatif-earn=' + encodeURIComponent(val);
              } else {
                setEarnSlider();
              }
            }, 100);
          });
        } else if (cmd.name === 'Explain my score') {
          hideModal();
          setTimeout(() => {
            function clickExplainButton() {
              const explainBtn = document.getElementById('explain-score-btn');
              if (explainBtn) explainBtn.click();
            }
            if (!window.location.pathname.endsWith('score.html')) {
              window.location.href = 'score.html#explain=score';
            } else {
              clickExplainButton();
            }
          }, 100);
        } else if (cmd.name === 'Add date filter') {
          hideModal();
          setTimeout(() => {
            function openDateFilter() {
              const addFilterBtn = document.getElementById('add-filter-btn');
              if (addFilterBtn) addFilterBtn.click();
              setTimeout(() => {
                const filterTypeDropdown = document.getElementById('filter-type-selected');
                if (filterTypeDropdown) {
                  const filterTypeList = document.getElementById('filter-type-list');
                  if (filterTypeList) {
                    const li = filterTypeList.querySelector('[data-value="date"]');
                    if (li) li.click();
                  }
                }
              }, 100);
            }
            if (!window.location.pathname.endsWith('dashboard.html')) {
              window.location.href = 'dashboard.html#filter=date';
            } else {
              openDateFilter();
            }
          }, 100);
        } else if (cmd.name === 'Add type filter') {
          hideModal();
          setTimeout(() => {
            function openTypeFilter() {
              const addFilterBtn = document.getElementById('add-filter-btn');
              if (addFilterBtn) addFilterBtn.click();
              setTimeout(() => {
                const filterTypeDropdown = document.getElementById('filter-type-selected');
                if (filterTypeDropdown) {
                  const filterTypeList = document.getElementById('filter-type-list');
                  if (filterTypeList) {
                    const li = filterTypeList.querySelector('[data-value="type"]');
                    if (li) li.click();
                  }
                }
              }, 100);
            }
            if (!window.location.pathname.endsWith('dashboard.html')) {
              window.location.href = 'dashboard.html#filter=type';
            } else {
              openTypeFilter();
            }
          }, 100);
        } else if (cmd.name === 'Add amount filter') {
          hideModal();
          setTimeout(() => {
            function openAmountFilter() {
              const addFilterBtn = document.getElementById('add-filter-btn');
              if (addFilterBtn) addFilterBtn.click();
              setTimeout(() => {
                const filterTypeDropdown = document.getElementById('filter-type-selected');
                if (filterTypeDropdown) {
                  const filterTypeList = document.getElementById('filter-type-list');
                  if (filterTypeList) {
                    const li = filterTypeList.querySelector('[data-value="amount"]');
                    if (li) li.click();
                  }
                }
              }, 100);
            }
            if (!window.location.pathname.endsWith('dashboard.html')) {
              window.location.href = 'dashboard.html#filter=amount';
            } else {
              openAmountFilter();
            }
          }, 100);
        } else if (cmd.name === 'Add store/source filter') {
          hideModal();
          setTimeout(() => {
            function openStoreFilter() {
              const addFilterBtn = document.getElementById('add-filter-btn');
              if (addFilterBtn) addFilterBtn.click();
              setTimeout(() => {
                const filterTypeDropdown = document.getElementById('filter-type-selected');
                if (filterTypeDropdown) {
                  const filterTypeList = document.getElementById('filter-type-list');
                  if (filterTypeList) {
                    const li = filterTypeList.querySelector('[data-value="store_source"]');
                    if (li) li.click();
                  }
                }
              }, 100);
            }
            if (!window.location.pathname.endsWith('dashboard.html')) {
              window.location.href = 'dashboard.html#filter=store_source';
            } else {
              openStoreFilter();
            }
          }, 100);
        } else if (cmd.name === 'Add method filter') {
          hideModal();
          setTimeout(() => {
            function openMethodFilter() {
              const addFilterBtn = document.getElementById('add-filter-btn');
              if (addFilterBtn) addFilterBtn.click();
              setTimeout(() => {
                const filterTypeDropdown = document.getElementById('filter-type-selected');
                if (filterTypeDropdown) {
                  const filterTypeList = document.getElementById('filter-type-list');
                  if (filterTypeList) {
                    const li = filterTypeList.querySelector('[data-value="method"]');
                    if (li) li.click();
                  }
                }
              }, 100);
            }
            if (!window.location.pathname.endsWith('dashboard.html')) {
              window.location.href = 'dashboard.html#filter=method';
            } else {
              openMethodFilter();
            }
          }, 100);
        } else if (cmd.name === 'Clear FundAI chat') {
          hideModal();
          setTimeout(() => {
            function clickClearChat() {
              const clearBtn = document.getElementById('clearChatButton');
              if (clearBtn) clearBtn.click();
            }
            if (!window.location.pathname.endsWith('fundAI.html')) {
              window.location.href = 'fundAI.html#clear=fundai';
            } else {
              clickClearChat();
            }
          }, 100);
        } else if (cmd.name === 'Speak transaction') {
          hideModal();
          setTimeout(() => {
            function openQuickTransactionAndMic() {
              const addModal = document.getElementById('openAddModal');
              if (addModal) addModal.click();
              setTimeout(() => {
                const quickTabBtn = document.querySelector('.modal-tab-btn[data-content-id="quick-transaction-content"]');
                if (quickTabBtn) quickTabBtn.click();
                setTimeout(() => {
                  const micBtn = document.getElementById('start-voice-recognition');
                  if (micBtn) micBtn.click();
                }, 100);
              }, 100);
            }
            if (!window.location.pathname.endsWith('dashboard.html')) {
              window.location.href = 'dashboard.html#speak-transaction=1';
            } else {
              openQuickTransactionAndMic();
            }
          }, 100);
        } else if (cmd.name === 'Speak preset') {
          hideModal();
          setTimeout(() => {
            function openQuickPresetAndMic() {
              const addModal = document.getElementById('openAddModal');
              if (addModal) addModal.click();
              setTimeout(() => {
                const quickTabBtn = document.querySelector('.modal-tab-btn[data-content-id="quick-preset-content"]');
                if (quickTabBtn) quickTabBtn.click();
                setTimeout(() => {
                  const micBtn = document.getElementById('start-voice-recognition-preset');
                  if (micBtn) micBtn.click();
                }, 100);
              }, 100);
            }
            if (!window.location.pathname.endsWith('dashboard.html')) {
              window.location.href = 'dashboard.html#speak-preset=1';
            } else {
              openQuickPresetAndMic();
            }
          }, 100);
        } else if (cmd.name === 'Ask for help') {
          enterPromptMode('What do you need help with?', function(question) {
            hideModal();
            setTimeout(() => {
              if (!window.location.pathname.endsWith('help.html')) {
                window.location.href = 'help.html#question=' + encodeURIComponent(question);
              } else {
                const helpInput = document.getElementById('help-ai-question');
                if (helpInput) {
                  helpInput.value = question;
                  helpInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
                }
              }
            }, 100);
          });
        } else if (cmd.name === 'Account settings') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('settings.html')) {
              window.location.href = 'settings.html#section=account';
            } else {
              const accountBtn = document.querySelector('.settings-section-item[data-section="account"]') || 
                                document.querySelector('.settings-section-item:nth-child(1)');
              if (accountBtn) accountBtn.click();
            }
          }, 100);
        } else if (cmd.name === 'Notification settings') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('settings.html')) {
              window.location.href = 'settings.html#section=notifications';
            } else {
              const notificationsBtn = document.querySelector('.settings-section-item[data-section="notifications"]') || 
                                      document.querySelector('.settings-section-item:nth-child(2)');
              if (notificationsBtn) notificationsBtn.click();
            }
          }, 100);
        } else if (cmd.name === 'Security settings') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('settings.html')) {
              window.location.href = 'settings.html#section=security';
            } else {
              const securityBtn = document.querySelector('.settings-section-item[data-section="security"]') || 
                                 document.querySelector('.settings-section-item:nth-child(3)');
              if (securityBtn) securityBtn.click();
            }
          }, 100);
        } else if (cmd.href) {
          window.location.href = cmd.href;
          hideModal();
        }
      };
      item.onmouseenter = () => {
        selectedIdx = i;
        updateSelection();
      };
      list.appendChild(item);
    });
    updateSelection();
  }

  function updateSelection() {
    const items = list.querySelectorAll('.cmd-item');
    items.forEach((el, i) => {
      if (i === selectedIdx) {
        el.classList.add('selected');
        el.setAttribute('aria-selected', 'true');
      } else {
        el.classList.remove('selected');
        el.setAttribute('aria-selected', 'false');
      }
    });
    if (items[selectedIdx]) items[selectedIdx].scrollIntoView({ block: 'nearest' });
  }

  function showModal() {
    modalBg.style.display = 'flex';
    setTimeout(() => {
      modalBg.classList.add('cmd-visible');
      input.focus();
    }, 10);
    input.value = '';
    filtered = [...commands];
    selectedIdx = 0;
    renderList();
  }

  function hideModal() {
    modalBg.classList.remove('cmd-visible');
    setTimeout(() => {
      modalBg.style.display = 'none';
    }, 180); // match fade duration
  }

  // Keyboard shortcuts
  let isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  document.addEventListener('keydown', function(e) {
    // Cmd/Ctrl+K toggles modal visibility
    if ((isMac && e.metaKey && e.key.toLowerCase() === 'k') || (!isMac && e.ctrlKey && e.key.toLowerCase() === 'k')) {
      e.preventDefault();
      if (modalBg.style.display === 'flex') {
        hideModal();
      } else {
        showModal();
      }
      return;
    }
  });

  // Modal events
  closeBtn.onclick = hideModal;
  modalBg.onclick = function(e) {
    if (e.target === modalBg) hideModal();
  };

  input.addEventListener('input', function() {
    const val = input.value.toLowerCase().trim();
    if (!val) {
      filtered = [...commands];
      selectedIdx = 0;
      renderList();
      return;
    }

    // Split search terms and filter out empty strings
    const searchTerms = val.split(/\s+/).filter(term => term.length > 0);
    
    filtered = commands.filter(cmd => {
      const cmdName = cmd.name.toLowerCase();
      const relatedTerms = (cmd.related || []).map(term => term.toLowerCase());
      
      // Check if all search terms match the command name or related terms
      return searchTerms.every(term => {
        // 1. Direct substring match in command name
        if (cmdName.includes(term)) return true;
        
        // 2. Direct substring match in related terms
        if (relatedTerms.some(related => related.includes(term))) return true;
        
        // 3. Acronym/initial letter matching for command name
        const words = cmdName.split(/\s+/);
        const initials = words.map(word => word.charAt(0)).join('');
        if (initials.includes(term)) return true;
        
        // 4. Acronym/initial letter matching for related terms
        for (const related of relatedTerms) {
          const relatedWords = related.split(/\s+/);
          const relatedInitials = relatedWords.map(word => word.charAt(0)).join('');
          if (relatedInitials.includes(term)) return true;
        }
        
        // 5. Word order independence - check if all characters in term appear in order in command name
        let termIndex = 0;
        for (let i = 0; i < cmdName.length && termIndex < term.length; i++) {
          if (cmdName[i] === term[termIndex]) {
            termIndex++;
          }
        }
        if (termIndex === term.length) return true;
        
        // 6. Word order independence - check if all characters in term appear in order in related terms
        for (const related of relatedTerms) {
          termIndex = 0;
          for (let i = 0; i < related.length && termIndex < term.length; i++) {
            if (related[i] === term[termIndex]) {
              termIndex++;
            }
          }
          if (termIndex === term.length) return true;
        }
        
        // 7. Fuzzy matching with word boundaries for command name
        const cmdWords = cmdName.split(/\s+/);
        for (const cmdWord of cmdWords) {
          if (cmdWord.startsWith(term) || cmdWord.includes(term)) {
            return true;
          }
        }
        
        // 8. Fuzzy matching with word boundaries for related terms
        for (const related of relatedTerms) {
          const relatedWords = related.split(/\s+/);
          for (const relatedWord of relatedWords) {
            if (relatedWord.startsWith(term) || relatedWord.includes(term)) {
              return true;
            }
          }
        }
        
        return false;
      });
    });
    
    selectedIdx = 0;
    renderList();
  });

  input.addEventListener('keydown', function(e) {
    if (promptMode && e.key === 'Enter') {
      e.preventDefault();
      if (promptCallback) {
        const val = input.value.trim();
        promptCallback(val);
      }
      exitPromptMode();
      return;
    }
    if (promptMode && e.key === 'Backspace' && input.value.trim() === '') {
      e.preventDefault();
      exitPromptMode();
      return;
    }
    if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
      e.preventDefault();
      if (filtered.length) selectedIdx = (selectedIdx + 1) % filtered.length;
      updateSelection();
    } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
      e.preventDefault();
      if (filtered.length) selectedIdx = (selectedIdx - 1 + filtered.length) % filtered.length;
      updateSelection();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIdx]) {
        const cmd = filtered[selectedIdx];
        if (cmd.name === 'Add reminder') {
          hideModal();
          setTimeout(() => {
            function openReminderModal() {
              const addBtn = document.getElementById('openAddModal');
              if (addBtn) addBtn.click();
            }
            if (!window.location.pathname.endsWith('reminders.html')) {
              window.location.href = 'reminders.html#add=reminder';
            } else {
              openReminderModal();
            }
          }, 100);
        } else if (cmd.name === 'Quick preset') {
          enterPromptMode('Describe your preset...', function(promptText) {
            hideModal();
            setTimeout(() => {
              function doQuickPreset() {
                const addModal = document.getElementById('openAddModal');
                if (addModal) addModal.click();
                setTimeout(() => {
                  const quickTabBtn = document.querySelector('.modal-tab-btn[data-content-id="quick-preset-content"]');
                  if (quickTabBtn) quickTabBtn.click();
                  setTimeout(() => {
                    const quickPrompt = document.querySelector('#quick-preset-content .quick-preset-prompt');
                    const quickAddBtn = document.querySelector('#quick-preset-content button[type="submit"]');
                    if (quickPrompt) quickPrompt.value = promptText;
                    if (quickAddBtn) quickAddBtn.click();
                  }, 100);
                }, 100);
              }
              if (!window.location.pathname.endsWith('dashboard.html')) {
                window.location.href = 'dashboard.html#quick-preset=' + encodeURIComponent(promptText);
              } else {
                doQuickPreset();
              }
            }, 100);
          });
        } else if (cmd.name === 'Scan receipt' || cmd.name === 'Import transactions' || cmd.name === 'Export transactions' || cmd.name === 'Add preset') {
          hideModal();
          setTimeout(() => {
            function openTab(tabId) {
              const addModal = document.getElementById('openAddModal');
              if (addModal) addModal.click();
              setTimeout(() => {
                const tabBtn = document.querySelector(`.modal-tab-btn[data-content-id="${tabId}"]`);
                if (tabBtn) tabBtn.click();
              }, 100);
            }
            let tabId = '';
            if (cmd.name === 'Scan receipt') tabId = 'receipt-scan-content';
            if (cmd.name === 'Import transactions') tabId = 'import-transactions-content';
            if (cmd.name === 'Export transactions') tabId = 'export-transactions-content';
            if (cmd.name === 'Add preset') tabId = 'add-preset-content';
            if (!window.location.pathname.endsWith('dashboard.html')) {
              window.location.href = `dashboard.html#tab=${tabId}`;
            } else {
              openTab(tabId);
            }
          }, 100);
        } else if (cmd.name === 'Quick transaction') {
          enterPromptMode('Describe your transaction...', function(promptText) {
            hideModal();
            setTimeout(() => {
              function doQuickTransaction() {
                const addModal = document.getElementById('openAddModal');
                if (addModal) addModal.click();
                setTimeout(() => {
                  const quickTabBtn = document.querySelector('.modal-tab-btn[data-content-id="quick-transaction-content"]');
                  if (quickTabBtn) quickTabBtn.click();
                  setTimeout(() => {
                    const quickPrompt = document.querySelector('#quick-transaction-content .quick-transaction-prompt');
                    const quickAddBtn = document.querySelector('#quick-transaction-content button[type="submit"]');
                    if (quickPrompt) quickPrompt.value = promptText;
                    if (quickAddBtn) quickAddBtn.click();
                  }, 100);
                }, 100);
              }
              if (!window.location.pathname.endsWith('dashboard.html')) {
                window.location.href = 'dashboard.html#quick-transaction=' + encodeURIComponent(promptText);
              } else {
                doQuickTransaction();
              }
            }, 100);
          });
        } else if (cmd.name === 'Add transaction') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('dashboard.html')) {
              window.location.href = 'dashboard.html#add=transaction';
            } else {
              const addModal = document.getElementById('openAddModal');
              if (addModal) addModal.click();
              // Ensure the 'Add Transaction' tab is active
              setTimeout(() => {
                const addTabBtn = document.querySelector('.modal-tab-btn[data-content-id="add-transaction-content"]');
                if (addTabBtn) addTabBtn.click();
              }, 50);
            }
          }, 100);
        } else if (cmd.name === 'Search transactions') {
          enterPromptMode('Enter search query...', function(query) {
            // Go to dashboard.html, set #search-input value, and trigger input event
            hideModal();
            setTimeout(() => {
              if (!window.location.pathname.endsWith('dashboard.html')) {
                window.location.href = 'dashboard.html#search=' + encodeURIComponent(query);
              } else {
                const searchInput = document.getElementById('search-input');
                if (searchInput) {
                  searchInput.value = query;
                  searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
              }
            }, 100);
          });
        } else if (cmd.name === 'AI search transactions') {
          enterPromptMode('Enter AI search query...', function(query) {
            hideModal();
            setTimeout(() => {
              if (!window.location.pathname.endsWith('dashboard.html')) {
                window.location.href = 'dashboard.html#search=' + encodeURIComponent(query) + '&ai=1';
              } else {
                const searchInput = document.getElementById('search-input');
                if (searchInput) {
                  searchInput.value = query;
                  searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                  // Simulate click on AI search button
                  const aiBtn = document.getElementById('ai-search-btn');
                  if (aiBtn) aiBtn.click();
                }
              }
            }, 100);
          });
        } else if (cmd.name === 'Search reminders') {
          enterPromptMode('Enter reminder search query...', function(query) {
            hideModal();
            setTimeout(() => {
              if (!window.location.pathname.endsWith('reminders.html')) {
                window.location.href = 'reminders.html#search=' + encodeURIComponent(query);
              } else {
                const searchInput = document.getElementById('reminder-search');
                if (searchInput) {
                  searchInput.value = query;
                  searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
              }
            }, 100);
          });
        } else if (cmd.name === 'Summarize this week') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('summary.html')) {
              window.location.href = 'summary.html#range=week';
            } else {
              const weekBtn = document.querySelector('.summary-toggle-btn[data-range="week"]');
              if (weekBtn) weekBtn.click();
            }
          }, 100);
        } else if (cmd.name === 'Summarize this month') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('summary.html')) {
              window.location.href = 'summary.html#range=month';
            } else {
              const monthBtn = document.querySelector('.summary-toggle-btn[data-range="month"]');
              if (monthBtn) monthBtn.click();
            }
          }, 100);
        } else if (cmd.name === 'Summarize this year') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('summary.html')) {
              window.location.href = 'summary.html#range=year';
            } else {
              const yearBtn = document.querySelector('.summary-toggle-btn[data-range="year"]');
              if (yearBtn) yearBtn.click();
            }
          }, 100);
        } else if (cmd.name === 'Export summary as image') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('summary.html')) {
              window.location.href = 'summary.html#export=image';
            } else {
              // Wait for summary content to load
              const waitForSummary = () => {
                const summaryContent = document.getElementById('summary-main-content');
                if (summaryContent && summaryContent.children.length > 0) {
                  const exportImageBtn = document.getElementById('export-image-btn');
                  if (exportImageBtn) exportImageBtn.click();
                } else {
                  setTimeout(waitForSummary, 100);
                }
              };
              waitForSummary();
            }
          }, 100);
        } else if (cmd.name === 'Export summary to email') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('summary.html')) {
              window.location.href = 'summary.html#export=email';
            } else {
              // Wait for summary content to load
              const waitForSummary = () => {
                const summaryContent = document.getElementById('summary-main-content');
                if (summaryContent && summaryContent.children.length > 0) {
                  const exportEmailBtn = document.getElementById('export-email-btn');
                  if (exportEmailBtn) exportEmailBtn.click();
                } else {
                  setTimeout(waitForSummary, 100);
                }
              };
              waitForSummary();
            }
          }, 100);
        } else if (cmd.name === 'Ask FundAI') {
          enterPromptMode('Ask FundAI anything...', function(query) {
            hideModal();
            setTimeout(() => {
              if (!window.location.pathname.endsWith('fundAI.html')) {
                window.location.href = 'fundAI.html#query=' + encodeURIComponent(query);
              } else {
                const chatInput = document.getElementById('chatInput');
                const sendButton = document.getElementById('sendButton');
                if (chatInput && sendButton) {
                  chatInput.value = query;
                  chatInput.dispatchEvent(new Event('input', { bubbles: true }));
                  sendButton.click();
                }
              }
            }, 100);
          });
        } else if (cmd.name === 'Edit monthly budget') {
          enterPromptMode('Enter monthly budget amount...', function(amount) {
            hideModal();
            setTimeout(() => {
              if (!window.location.pathname.endsWith('plan.html')) {
                window.location.href = 'plan.html#budget=' + encodeURIComponent(amount);
              } else {
                const budgetInput = document.getElementById('budget-input');
                const budgetForm = document.getElementById('budget-form');
                if (budgetInput && budgetForm) {
                  budgetInput.value = amount;
                  budgetForm.querySelector('button[type="submit"]').click();
                }
              }
            }, 100);
          });
        } else if (cmd.name === 'Edit monthly goal') {
          enterPromptMode('Enter monthly goal amount...', function(amount) {
            hideModal();
            setTimeout(() => {
              if (!window.location.pathname.endsWith('plan.html')) {
                window.location.href = 'plan.html#goal=' + encodeURIComponent(amount);
              } else {
                const goalInput = document.getElementById('goal-input');
                const goalForm = document.getElementById('goal-form');
                if (goalInput && goalForm) {
                  goalInput.value = amount;
                  goalForm.querySelector('button[type="submit"]').click();
                }
              }
            }, 100);
          });
        } else if (cmd.name === 'Sort by Default') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('dashboard.html')) {
              window.location.href = 'dashboard.html#sort=default';
            } else {
              const sortDropdown = document.getElementById('sort-selected');
              if (sortDropdown) {
                sortDropdown.textContent = 'Sort by Default';
                sortDropdown.dataset.value = 'default';
                // Trigger the sort function
                if (typeof sortTransactions === 'function') {
                  sortTransactions('default');
                }
              }
            }
          }, 100);
        } else if (cmd.name === 'Sort by Date: Oldest First') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('dashboard.html')) {
              window.location.href = 'dashboard.html#sort=date_asc';
            } else {
              const sortDropdown = document.getElementById('sort-selected');
              if (sortDropdown) {
                sortDropdown.textContent = 'Sort by Date: Oldest First';
                sortDropdown.dataset.value = 'date_asc';
                // Trigger the sort function
                if (typeof sortTransactions === 'function') {
                  sortTransactions('date_asc');
                }
              }
            }
          }, 100);
        } else if (cmd.name === 'Sort by Date: Newest First') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('dashboard.html')) {
              window.location.href = 'dashboard.html#sort=date_desc';
            } else {
              const sortDropdown = document.getElementById('sort-selected');
              if (sortDropdown) {
                sortDropdown.textContent = 'Sort by Date: Newest First';
                sortDropdown.dataset.value = 'date_desc';
                // Trigger the sort function
                if (typeof sortTransactions === 'function') {
                  sortTransactions('date_desc');
                }
              }
            }
          }, 100);
        } else if (cmd.name === 'Sort by Amount: Low to High') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('dashboard.html')) {
              window.location.href = 'dashboard.html#sort=amount_asc';
            } else {
              const sortDropdown = document.getElementById('sort-selected');
              if (sortDropdown) {
                sortDropdown.textContent = 'Sort by Amount: Low to High';
                sortDropdown.dataset.value = 'amount_asc';
                // Trigger the sort function
                if (typeof sortTransactions === 'function') {
                  sortTransactions('amount_asc');
                }
              }
            }
          }, 100);
        } else if (cmd.name === 'Sort by Amount: High to Low') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('dashboard.html')) {
              window.location.href = 'dashboard.html#sort=amount_desc';
            } else {
              const sortDropdown = document.getElementById('sort-selected');
              if (sortDropdown) {
                sortDropdown.textContent = 'Sort by Amount: High to Low';
                sortDropdown.dataset.value = 'amount_desc';
                // Trigger the sort function
                if (typeof sortTransactions === 'function') {
                  sortTransactions('amount_desc');
                }
              }
            }
          }, 100);
        } else if (cmd.name === 'Reminders') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('reminders.html')) {
              window.location.href = 'reminders.html';
            } else {
              const remindersBtn = document.getElementById('reminders-btn');
              if (remindersBtn) remindersBtn.click();
            }
          }, 100);
        } else if (cmd.name === 'Add reminder') {
          hideModal();
          setTimeout(() => {
            function openReminderModal() {
              const addBtn = document.getElementById('openAddModal');
              if (addBtn) addBtn.click();
            }
            if (!window.location.pathname.endsWith('reminders.html')) {
              window.location.href = 'reminders.html#add=reminder';
            } else {
              openReminderModal();
            }
          }, 100);
        } else if (cmd.name === 'Search reminders') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('reminders.html')) {
              window.location.href = 'reminders.html#search=' + encodeURIComponent(input.value);
            } else {
              const searchInput = document.getElementById('reminder-search');
              if (searchInput) {
                searchInput.value = input.value;
                searchInput.dispatchEvent(new Event('input', { bubbles: true }));
              }
            }
          }, 100);
        } else if (cmd.name === 'Summary') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('summary.html')) {
              window.location.href = 'summary.html';
            } else {
              const summaryBtn = document.getElementById('summary-btn');
              if (summaryBtn) summaryBtn.click();
            }
          }, 100);
        } else if (cmd.name === 'Summarize this week') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('summary.html')) {
              window.location.href = 'summary.html#range=week';
            } else {
              const weekBtn = document.querySelector('.summary-toggle-btn[data-range="week"]');
              if (weekBtn) weekBtn.click();
            }
          }, 100);
        } else if (cmd.name === 'Summarize this month') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('summary.html')) {
              window.location.href = 'summary.html#range=month';
            } else {
              const monthBtn = document.querySelector('.summary-toggle-btn[data-range="month"]');
              if (monthBtn) monthBtn.click();
            }
          }, 100);
        } else if (cmd.name === 'Summarize this year') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('summary.html')) {
              window.location.href = 'summary.html#range=year';
            } else {
              const yearBtn = document.querySelector('.summary-toggle-btn[data-range="year"]');
              if (yearBtn) yearBtn.click();
            }
          }, 100);
        } else if (cmd.name === 'Export summary as image') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('summary.html')) {
              window.location.href = 'summary.html#export=image';
            } else {
              // Wait for summary content to load
              const waitForSummary = () => {
                const summaryContent = document.getElementById('summary-main-content');
                if (summaryContent && summaryContent.children.length > 0) {
                  const exportImageBtn = document.getElementById('export-image-btn');
                  if (exportImageBtn) exportImageBtn.click();
                } else {
                  setTimeout(waitForSummary, 100);
                }
              };
              waitForSummary();
            }
          }, 100);
        } else if (cmd.name === 'Export summary to email') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('summary.html')) {
              window.location.href = 'summary.html#export=email';
            } else {
              // Wait for summary content to load
              const waitForSummary = () => {
                const summaryContent = document.getElementById('summary-main-content');
                if (summaryContent && summaryContent.children.length > 0) {
                  const exportEmailBtn = document.getElementById('export-email-btn');
                  if (exportEmailBtn) exportEmailBtn.click();
                } else {
                  setTimeout(waitForSummary, 100);
                }
              };
              waitForSummary();
            }
          }, 100);
        } else if (cmd.name === 'Plan') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('plan.html')) {
              window.location.href = 'plan.html';
            } else {
              const planBtn = document.getElementById('plan-btn');
              if (planBtn) planBtn.click();
            }
          }, 100);
        } else if (cmd.name === 'Edit monthly budget') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('plan.html')) {
              window.location.href = 'plan.html#edit-budget';
            } else {
              const budgetBtn = document.getElementById('budget-btn');
              if (budgetBtn) budgetBtn.click();
            }
          }, 100);
        } else if (cmd.name === 'Edit monthly goal') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('plan.html')) {
              window.location.href = 'plan.html#edit-goal';
            } else {
              const goalBtn = document.getElementById('goal-btn');
              if (goalBtn) goalBtn.click();
            }
          }, 100);
        } else if (cmd.name === 'Simulate what-if spending') {
          enterPromptMode('Enter daily spend (1-500)', function(val) {
            hideModal();
            setTimeout(() => {
              function setSpendSlider() {
                const spendSlider = document.getElementById('whatif-spend-slider');
                if (spendSlider) {
                  let num = parseFloat(val);
                  if (isNaN(num)) num = 1;
                  num = Math.max(1, Math.min(500, num));
                  spendSlider.value = num;
                  spendSlider.dispatchEvent(new Event('input', { bubbles: true }));
                  // Scroll the what-if widget into view
                  const whatIfWidget = document.getElementById('what-if-widget');
                  if (whatIfWidget) {
                    whatIfWidget.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }
              }
              if (!window.location.pathname.endsWith('plan.html')) {
                window.location.href = 'plan.html#whatif-spend=' + encodeURIComponent(val);
              } else {
                setSpendSlider();
              }
            }, 100);
          });
        } else if (cmd.name === 'Simulate what-if earnings') {
          enterPromptMode('Enter daily earn (1-500)', function(val) {
            hideModal();
            setTimeout(() => {
              function setEarnSlider() {
                const earnSlider = document.getElementById('whatif-earn-slider');
                if (earnSlider) {
                  let num = parseFloat(val);
                  if (isNaN(num)) num = 1;
                  num = Math.max(1, Math.min(500, num));
                  earnSlider.value = num;
                  earnSlider.dispatchEvent(new Event('input', { bubbles: true }));
                  // Scroll the what-if widget into view
                  const whatIfWidget = document.getElementById('what-if-widget');
                  if (whatIfWidget) {
                    whatIfWidget.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }
              }
              if (!window.location.pathname.endsWith('plan.html')) {
                window.location.href = 'plan.html#whatif-earn=' + encodeURIComponent(val);
              } else {
                setEarnSlider();
              }
            }, 100);
          });
        } else if (cmd.name === 'Explain my score') {
          hideModal();
          setTimeout(() => {
            function clickExplainButton() {
              const explainBtn = document.getElementById('explain-score-btn');
              if (explainBtn) explainBtn.click();
            }
            if (!window.location.pathname.endsWith('score.html')) {
              window.location.href = 'score.html#explain=score';
            } else {
              clickExplainButton();
            }
          }, 100);
        } else if (cmd.name === 'Add date filter') {
          hideModal();
          setTimeout(() => {
            function openDateFilter() {
              const addFilterBtn = document.getElementById('add-filter-btn');
              if (addFilterBtn) addFilterBtn.click();
              setTimeout(() => {
                const filterTypeDropdown = document.getElementById('filter-type-selected');
                if (filterTypeDropdown) {
                  const filterTypeList = document.getElementById('filter-type-list');
                  if (filterTypeList) {
                    const li = filterTypeList.querySelector('[data-value="date"]');
                    if (li) li.click();
                  }
                }
              }, 100);
            }
            if (!window.location.pathname.endsWith('dashboard.html')) {
              window.location.href = 'dashboard.html#filter=date';
            } else {
              openDateFilter();
            }
          }, 100);
        } else if (cmd.name === 'Add type filter') {
          hideModal();
          setTimeout(() => {
            function openTypeFilter() {
              const addFilterBtn = document.getElementById('add-filter-btn');
              if (addFilterBtn) addFilterBtn.click();
              setTimeout(() => {
                const filterTypeDropdown = document.getElementById('filter-type-selected');
                if (filterTypeDropdown) {
                  const filterTypeList = document.getElementById('filter-type-list');
                  if (filterTypeList) {
                    const li = filterTypeList.querySelector('[data-value="type"]');
                    if (li) li.click();
                  }
                }
              }, 100);
            }
            if (!window.location.pathname.endsWith('dashboard.html')) {
              window.location.href = 'dashboard.html#filter=type';
            } else {
              openTypeFilter();
            }
          }, 100);
        } else if (cmd.name === 'Add amount filter') {
          hideModal();
          setTimeout(() => {
            function openAmountFilter() {
              const addFilterBtn = document.getElementById('add-filter-btn');
              if (addFilterBtn) addFilterBtn.click();
              setTimeout(() => {
                const filterTypeDropdown = document.getElementById('filter-type-selected');
                if (filterTypeDropdown) {
                  const filterTypeList = document.getElementById('filter-type-list');
                  if (filterTypeList) {
                    const li = filterTypeList.querySelector('[data-value="amount"]');
                    if (li) li.click();
                  }
                }
              }, 100);
            }
            if (!window.location.pathname.endsWith('dashboard.html')) {
              window.location.href = 'dashboard.html#filter=amount';
            } else {
              openAmountFilter();
            }
          }, 100);
        } else if (cmd.name === 'Add store/source filter') {
          hideModal();
          setTimeout(() => {
            function openStoreFilter() {
              const addFilterBtn = document.getElementById('add-filter-btn');
              if (addFilterBtn) addFilterBtn.click();
              setTimeout(() => {
                const filterTypeDropdown = document.getElementById('filter-type-selected');
                if (filterTypeDropdown) {
                  const filterTypeList = document.getElementById('filter-type-list');
                  if (filterTypeList) {
                    const li = filterTypeList.querySelector('[data-value="store_source"]');
                    if (li) li.click();
                  }
                }
              }, 100);
            }
            if (!window.location.pathname.endsWith('dashboard.html')) {
              window.location.href = 'dashboard.html#filter=store_source';
            } else {
              openStoreFilter();
            }
          }, 100);
        } else if (cmd.name === 'Add method filter') {
          hideModal();
          setTimeout(() => {
            function openMethodFilter() {
              const addFilterBtn = document.getElementById('add-filter-btn');
              if (addFilterBtn) addFilterBtn.click();
              setTimeout(() => {
                const filterTypeDropdown = document.getElementById('filter-type-selected');
                if (filterTypeDropdown) {
                  const filterTypeList = document.getElementById('filter-type-list');
                  if (filterTypeList) {
                    const li = filterTypeList.querySelector('[data-value="method"]');
                    if (li) li.click();
                  }
                }
              }, 100);
            }
            if (!window.location.pathname.endsWith('dashboard.html')) {
              window.location.href = 'dashboard.html#filter=method';
            } else {
              openMethodFilter();
            }
          }, 100);
        } else if (cmd.name === 'Clear FundAI chat') {
          hideModal();
          setTimeout(() => {
            function clickClearChat() {
              const clearBtn = document.getElementById('clearChatButton');
              if (clearBtn) clearBtn.click();
            }
            if (!window.location.pathname.endsWith('fundAI.html')) {
              window.location.href = 'fundAI.html#clear=fundai';
            } else {
              clickClearChat();
            }
          }, 100);
        } else if (cmd.name === 'Speak transaction') {
          hideModal();
          setTimeout(() => {
            function openQuickTransactionAndMic() {
              const addModal = document.getElementById('openAddModal');
              if (addModal) addModal.click();
              setTimeout(() => {
                const quickTabBtn = document.querySelector('.modal-tab-btn[data-content-id="quick-transaction-content"]');
                if (quickTabBtn) quickTabBtn.click();
                setTimeout(() => {
                  const micBtn = document.getElementById('start-voice-recognition');
                  if (micBtn) micBtn.click();
                }, 100);
              }, 100);
            }
            if (!window.location.pathname.endsWith('dashboard.html')) {
              window.location.href = 'dashboard.html#speak-transaction=1';
            } else {
              openQuickTransactionAndMic();
            }
          }, 100);
        } else if (cmd.name === 'Speak preset') {
          hideModal();
          setTimeout(() => {
            function openQuickPresetAndMic() {
              const addModal = document.getElementById('openAddModal');
              if (addModal) addModal.click();
              setTimeout(() => {
                const quickTabBtn = document.querySelector('.modal-tab-btn[data-content-id="quick-preset-content"]');
                if (quickTabBtn) quickTabBtn.click();
                setTimeout(() => {
                  const micBtn = document.getElementById('start-voice-recognition-preset');
                  if (micBtn) micBtn.click();
                }, 100);
              }, 100);
            }
            if (!window.location.pathname.endsWith('dashboard.html')) {
              window.location.href = 'dashboard.html#speak-preset=1';
            } else {
              openQuickPresetAndMic();
            }
          }, 100);
        } else if (cmd.name === 'Ask for help') {
          enterPromptMode('What do you need help with?', function(question) {
            hideModal();
            setTimeout(() => {
              if (!window.location.pathname.endsWith('help.html')) {
                window.location.href = 'help.html#question=' + encodeURIComponent(question);
              } else {
                const helpInput = document.getElementById('help-ai-question');
                if (helpInput) {
                  helpInput.value = question;
                  helpInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
                }
              }
            }, 100);
          });
        } else if (cmd.name === 'Account settings') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('settings.html')) {
              window.location.href = 'settings.html#section=account';
            } else {
              const accountBtn = document.querySelector('.settings-section-item[data-section="account"]') || 
                                document.querySelector('.settings-section-item:nth-child(1)');
              if (accountBtn) accountBtn.click();
            }
          }, 100);
        } else if (cmd.name === 'Notification settings') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('settings.html')) {
              window.location.href = 'settings.html#section=notifications';
            } else {
              const notificationsBtn = document.querySelector('.settings-section-item[data-section="notifications"]') || 
                                      document.querySelector('.settings-section-item:nth-child(2)');
              if (notificationsBtn) notificationsBtn.click();
            }
          }, 100);
        } else if (cmd.name === 'Security settings') {
          hideModal();
          setTimeout(() => {
            if (!window.location.pathname.endsWith('settings.html')) {
              window.location.href = 'settings.html#section=security';
            } else {
              const securityBtn = document.querySelector('.settings-section-item[data-section="security"]') || 
                                 document.querySelector('.settings-section-item:nth-child(3)');
              if (securityBtn) securityBtn.click();
            }
          }, 100);
        } else if (cmd.href) {
          window.location.href = cmd.href;
          hideModal();
        }
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      hideModal();
      return;
    }
  });

  // Trap focus inside modal
  modalBg.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      const focusables = modalBg.querySelectorAll('input,button');
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });

  function enterPromptMode(placeholder, callback) {
    promptMode = true;
    promptCallback = callback;
    input.value = '';
    input.placeholder = placeholder;
    
    // Set input type to number for budget, goal, and what-if commands
    if (placeholder.includes('budget') || placeholder.includes('goal') || placeholder.includes('daily spend') || placeholder.includes('daily earn')) {
      input.type = 'number';
      input.min = '0';
      input.step = '0.01';
      if (placeholder.includes('daily spend') || placeholder.includes('daily earn')) {
        input.min = '1';
        input.max = '500';
      }
    } else {
      input.type = 'text';
    }
    
    renderList();
    setTimeout(() => input.focus(), 10);
  }

  function exitPromptMode() {
    promptMode = false;
    promptCallback = null;
    input.value = '';
    input.placeholder = 'Search commands...';
    input.type = 'text'; // Always reset to text type
    filtered = [...commands];
    selectedIdx = 0;
    renderList();
    setTimeout(() => input.focus(), 10);
  }

  // On page load, if #search= is in the hash, set the dashboard search input
  if (window.location.pathname.endsWith('dashboard.html') && window.location.hash.startsWith('#search=')) {
    const hash = window.location.hash.replace('#search=', '');
    let query = hash;
    let ai = false;
    if (query.includes('&ai=1')) {
      ai = true;
      query = query.replace('&ai=1', '');
    }
    query = decodeURIComponent(query);
    window.location.hash = '';
    window.addEventListener('DOMContentLoaded', function() {
      const searchInput = document.getElementById('search-input');
      if (searchInput) {
        searchInput.value = query;
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        if (ai) {
          const aiBtn = document.getElementById('ai-search-btn');
          if (aiBtn) aiBtn.click();
        }
      }
    });
  }

  // On page load, if #search= is in the hash, set the reminders search input
  if (window.location.pathname.endsWith('reminders.html') && window.location.hash.startsWith('#search=')) {
    const query = decodeURIComponent(window.location.hash.replace('#search=', ''));
    window.location.hash = '';
    window.addEventListener('DOMContentLoaded', function() {
      const searchInput = document.getElementById('reminder-search');
      if (searchInput) {
        searchInput.value = query;
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
  }

  // On page load, if #range= is in the hash, set the summary range
  if (window.location.pathname.endsWith('summary.html') && window.location.hash.startsWith('#range=')) {
    const range = window.location.hash.replace('#range=', '');
    window.location.hash = '';
    window.addEventListener('DOMContentLoaded', function() {
      const rangeBtn = document.querySelector(`.summary-toggle-btn[data-range="${range}"]`);
      if (rangeBtn) rangeBtn.click();
    });
  }

  // On page load, if #export= is in the hash, trigger the export action
  if (window.location.pathname.endsWith('summary.html') && window.location.hash.startsWith('#export=')) {
    const exportType = window.location.hash.replace('#export=', '');
    window.location.hash = '';
    
    // Wait for page to fully load and summary content to be ready
    const waitForSummaryAndExport = () => {
      const summaryContent = document.getElementById('summary-main-content');
      if (summaryContent && summaryContent.children.length > 0) {
        // Additional delay to ensure charts are rendered
        setTimeout(() => {
          if (exportType === 'image') {
            const exportImageBtn = document.getElementById('export-image-btn');
            if (exportImageBtn) exportImageBtn.click();
          } else if (exportType === 'email') {
            const exportEmailBtn = document.getElementById('export-email-btn');
            if (exportEmailBtn) exportEmailBtn.click();
          }
        }, 1000); // Wait 1 second for charts to render
      } else {
        setTimeout(waitForSummaryAndExport, 100);
      }
    };
    
    window.addEventListener('DOMContentLoaded', function() {
      // Start waiting after DOM is loaded
      setTimeout(waitForSummaryAndExport, 100);
    });
  }

  // On page load, if #query= is in the hash, set the FundAI query
  if (window.location.pathname.endsWith('fundAI.html') && window.location.hash.startsWith('#query=')) {
    const query = decodeURIComponent(window.location.hash.replace('#query=', ''));
    window.location.hash = '';
    window.addEventListener('DOMContentLoaded', function() {
      // Wait for FundAI to initialize
      setTimeout(() => {
        const chatInput = document.getElementById('chatInput');
        const sendButton = document.getElementById('sendButton');
        if (chatInput && sendButton) {
          chatInput.value = query;
          chatInput.dispatchEvent(new Event('input', { bubbles: true }));
          sendButton.click();
        }
      }, 500); // Wait 500ms for FundAI to initialize
    });
  }

  // On page load, if #budget= is in the hash, set the budget
  if (window.location.pathname.endsWith('plan.html') && window.location.hash.startsWith('#budget=')) {
    const amount = decodeURIComponent(window.location.hash.replace('#budget=', ''));
    window.location.hash = '';
    window.addEventListener('DOMContentLoaded', function() {
      setTimeout(() => {
        const budgetInput = document.getElementById('budget-input');
        const budgetForm = document.getElementById('budget-form');
        if (budgetInput && budgetForm) {
          budgetInput.value = amount;
          budgetForm.querySelector('button[type="submit"]').click();
        }
      }, 100);
    });
  }

  // On page load, if #goal= is in the hash, set the goal
  if (window.location.pathname.endsWith('plan.html') && window.location.hash.startsWith('#goal=')) {
    const amount = decodeURIComponent(window.location.hash.replace('#goal=', ''));
    window.location.hash = '';
    window.addEventListener('DOMContentLoaded', function() {
      setTimeout(() => {
        const goalInput = document.getElementById('goal-input');
        const goalForm = document.getElementById('goal-form');
        if (goalInput && goalForm) {
          goalInput.value = amount;
          goalForm.querySelector('button[type="submit"]').click();
        }
      }, 100);
    });
  }

  // On page load, if #sort= is in the hash, set the sort
  if (window.location.pathname.endsWith('dashboard.html') && window.location.hash.startsWith('#sort=')) {
    const sortType = window.location.hash.replace('#sort=', '');
    window.location.hash = '';
    window.addEventListener('DOMContentLoaded', function() {
      setTimeout(() => {
        const sortDropdown = document.getElementById('sort-selected');
        if (sortDropdown) {
          let displayText = 'Sort by Default';
          let sortValue = 'default';
          
          switch (sortType) {
            case 'default':
              displayText = 'Sort by Default';
              sortValue = 'default';
              break;
            case 'date_asc':
              displayText = 'Sort by Date: Oldest First';
              sortValue = 'date_asc';
              break;
            case 'date_desc':
              displayText = 'Sort by Date: Newest First';
              sortValue = 'date_desc';
              break;
            case 'amount_asc':
              displayText = 'Sort by Amount: Low to High';
              sortValue = 'amount_asc';
              break;
            case 'amount_desc':
              displayText = 'Sort by Amount: High to Low';
              sortValue = 'amount_desc';
              break;
          }
          
          sortDropdown.textContent = displayText;
          sortDropdown.dataset.value = sortValue;
          
          // Trigger the sort function
          if (typeof sortTransactions === 'function') {
            sortTransactions(sortValue);
          }
        }
      }, 100);
    });
  }

  // On page load, if #add=transaction is in the hash, open the add transaction modal
  if (window.location.pathname.endsWith('dashboard.html') && window.location.hash.startsWith('#add=transaction')) {
    window.location.hash = '';
    window.addEventListener('DOMContentLoaded', function() {
      setTimeout(() => {
        const addModal = document.getElementById('openAddModal');
        if (addModal) addModal.click();
        setTimeout(() => {
          const addTabBtn = document.querySelector('.modal-tab-btn[data-content-id="add-transaction-content"]');
          if (addTabBtn) addTabBtn.click();
        }, 50);
      }, 100);
    });
  }

  // On page load, if #quick-transaction= is in the hash, fill and submit the quick transaction form
  if (window.location.pathname.endsWith('dashboard.html') && window.location.hash.startsWith('#quick-transaction=')) {
    const promptText = decodeURIComponent(window.location.hash.replace('#quick-transaction=', ''));
    window.location.hash = '';
    window.addEventListener('DOMContentLoaded', function() {
      setTimeout(() => {
        const addModal = document.getElementById('openAddModal');
        if (addModal) addModal.click();
        setTimeout(() => {
          const quickTabBtn = document.querySelector('.modal-tab-btn[data-content-id="quick-transaction-content"]');
          if (quickTabBtn) quickTabBtn.click();
          setTimeout(() => {
            const quickPrompt = document.querySelector('#quick-transaction-content .quick-transaction-prompt');
            const quickAddBtn = document.querySelector('#quick-transaction-content button[type="submit"]');
            if (quickPrompt) quickPrompt.value = promptText;
            if (quickAddBtn) quickAddBtn.click();
          }, 100);
        }, 100);
      }, 100);
    });
  }

  // On page load, if #tab=... is in the hash, open the correct modal tab
  if (window.location.pathname.endsWith('dashboard.html') && window.location.hash.startsWith('#tab=')) {
    const tabId = window.location.hash.replace('#tab=', '');
    window.location.hash = '';
    window.addEventListener('DOMContentLoaded', function() {
      setTimeout(() => {
        const addModal = document.getElementById('openAddModal');
        if (addModal) addModal.click();
        setTimeout(() => {
          const tabBtn = document.querySelector(`.modal-tab-btn[data-content-id="${tabId}"]`);
          if (tabBtn) tabBtn.click();
        }, 100);
      }, 100);
    });
  }

  // On page load, if #quick-preset= is in the hash, fill and submit the quick preset form
  if (window.location.pathname.endsWith('dashboard.html') && window.location.hash.startsWith('#quick-preset=')) {
    const promptText = decodeURIComponent(window.location.hash.replace('#quick-preset=', ''));
    window.location.hash = '';
    window.addEventListener('DOMContentLoaded', function() {
      setTimeout(() => {
        const addModal = document.getElementById('openAddModal');
        if (addModal) addModal.click();
        setTimeout(() => {
          const quickTabBtn = document.querySelector('.modal-tab-btn[data-content-id="quick-preset-content"]');
          if (quickTabBtn) quickTabBtn.click();
          setTimeout(() => {
            const quickPrompt = document.querySelector('#quick-preset-content .quick-preset-prompt');
            const quickAddBtn = document.querySelector('#quick-preset-content button[type="submit"]');
            if (quickPrompt) quickPrompt.value = promptText;
            if (quickAddBtn) quickAddBtn.click();
          }, 100);
        }, 100);
      }, 100);
    });
  }

  // On page load, if #add=reminder is in the hash, open the add reminder modal
  if (window.location.pathname.endsWith('reminders.html') && window.location.hash.startsWith('#add=reminder')) {
    window.location.hash = '';
    window.addEventListener('DOMContentLoaded', function() {
      setTimeout(() => {
        const addBtn = document.getElementById('openAddModal');
        if (addBtn) addBtn.click();
      }, 100);
    });
  }

  // On page load, if #whatif-spend= is in the hash, set the spend slider
  if (window.location.pathname.endsWith('plan.html') && window.location.hash.startsWith('#whatif-spend=')) {
    const val = decodeURIComponent(window.location.hash.replace('#whatif-spend=', ''));
    window.location.hash = '';
    window.addEventListener('DOMContentLoaded', function() {
      setTimeout(() => {
        const spendSlider = document.getElementById('whatif-spend-slider');
        if (spendSlider) {
          let num = parseFloat(val);
          if (isNaN(num)) num = 1;
          num = Math.max(1, Math.min(500, num));
          spendSlider.value = num;
          spendSlider.dispatchEvent(new Event('input', { bubbles: true }));
          // Scroll the what-if widget into view
          const whatIfWidget = document.getElementById('what-if-widget');
          if (whatIfWidget) {
            whatIfWidget.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }, 100);
    });
  }

  // On page load, if #whatif-earn= is in the hash, set the earn slider
  if (window.location.pathname.endsWith('plan.html') && window.location.hash.startsWith('#whatif-earn=')) {
    const val = decodeURIComponent(window.location.hash.replace('#whatif-earn=', ''));
    window.location.hash = '';
    window.addEventListener('DOMContentLoaded', function() {
      setTimeout(() => {
        const earnSlider = document.getElementById('whatif-earn-slider');
        if (earnSlider) {
          let num = parseFloat(val);
          if (isNaN(num)) num = 1;
          num = Math.max(1, Math.min(500, num));
          earnSlider.value = num;
          earnSlider.dispatchEvent(new Event('input', { bubbles: true }));
          // Scroll the what-if widget into view
          const whatIfWidget = document.getElementById('what-if-widget');
          if (whatIfWidget) {
            whatIfWidget.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }, 100);
    });
  }

  // On page load, if #explain=score is in the hash, click the explain score button
  if (window.location.pathname.endsWith('score.html') && window.location.hash.startsWith('#explain=score')) {
    window.location.hash = '';
    window.addEventListener('DOMContentLoaded', function() {
      setTimeout(() => {
        const explainBtn = document.getElementById('explain-score-btn');
        if (explainBtn) explainBtn.click();
      }, 100);
    });
  }

  // On page load, if #filter= is in the hash, open the filter modal with the specified type
  if (window.location.pathname.endsWith('dashboard.html') && window.location.hash.startsWith('#filter=')) {
    const filterType = window.location.hash.replace('#filter=', '');
    window.location.hash = '';
    window.addEventListener('DOMContentLoaded', function() {
      setTimeout(() => {
        const addFilterBtn = document.getElementById('add-filter-btn');
        if (addFilterBtn) addFilterBtn.click();
        setTimeout(() => {
          const filterTypeDropdown = document.getElementById('filter-type-selected');
          if (filterTypeDropdown) {
            let displayText = 'Date';
            let filterValue = 'date';
            
            switch (filterType) {
              case 'date':
                displayText = 'Date';
                filterValue = 'date';
                break;
              case 'type':
                displayText = 'Type';
                filterValue = 'type';
                break;
              case 'amount':
                displayText = 'Amount';
                filterValue = 'amount';
                break;
              case 'store_source':
                displayText = 'Store/Source';
                filterValue = 'store_source';
                break;
              case 'method':
                displayText = 'Method';
                filterValue = 'method';
                break;
            }
            
            filterTypeDropdown.textContent = displayText;
            filterTypeDropdown.dataset.value = filterValue;
            
            // Trigger the filter type change to show the appropriate inputs
            const event = new Event('click', { bubbles: true });
            filterTypeDropdown.dispatchEvent(event);
          }
        }, 100);
      }, 100);
    });
  }

  // On page load, if #clear=fundai is in the hash, click the clear chat button
  if (window.location.pathname.endsWith('fundAI.html') && window.location.hash.startsWith('#clear=fundai')) {
    window.location.hash = '';
    window.addEventListener('DOMContentLoaded', function() {
      setTimeout(() => {
        const clearBtn = document.getElementById('clearChatButton');
        if (clearBtn) clearBtn.click();
      }, 100);
    });
  }

  // On page load, if #speak-transaction=1 is in the hash, open quick transaction modal and click mic
  if (window.location.pathname.endsWith('dashboard.html') && window.location.hash.startsWith('#speak-transaction=1')) {
    window.location.hash = '';
    window.addEventListener('DOMContentLoaded', function() {
      setTimeout(() => {
        const addModal = document.getElementById('openAddModal');
        if (addModal) addModal.click();
        setTimeout(() => {
          const quickTabBtn = document.querySelector('.modal-tab-btn[data-content-id="quick-transaction-content"]');
          if (quickTabBtn) quickTabBtn.click();
          setTimeout(() => {
            const micBtn = document.getElementById('start-voice-recognition');
            if (micBtn) micBtn.click();
          }, 100);
        }, 100);
      }, 100);
    });
  }

  // On page load, if #speak-preset=1 is in the hash, open quick preset modal and click mic
  if (window.location.pathname.endsWith('dashboard.html') && window.location.hash.startsWith('#speak-preset=1')) {
    window.location.hash = '';
    window.addEventListener('DOMContentLoaded', function() {
      setTimeout(() => {
        const addModal = document.getElementById('openAddModal');
        if (addModal) addModal.click();
        setTimeout(() => {
          const quickTabBtn = document.querySelector('.modal-tab-btn[data-content-id="quick-preset-content"]');
          if (quickTabBtn) quickTabBtn.click();
          setTimeout(() => {
            const micBtn = document.getElementById('start-voice-recognition-preset');
            if (micBtn) micBtn.click();
          }, 100);
        }, 100);
      }, 100);
    });
  }

  // On page load, if #question= is in the hash, set the help question and trigger AI
  if (window.location.pathname.endsWith('help.html') && window.location.hash.startsWith('#question=')) {
    const question = decodeURIComponent(window.location.hash.replace('#question=', ''));
    window.location.hash = '';
    window.addEventListener('DOMContentLoaded', function() {
      setTimeout(() => {
        const helpInput = document.getElementById('help-ai-question');
        if (helpInput) {
          helpInput.value = question;
          helpInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        }
      }, 100);
    });
  }

  // On page load, if #section= is in the hash, set the settings section
  if (window.location.pathname.endsWith('settings.html') && window.location.hash.startsWith('#section=')) {
    const section = window.location.hash.replace('#section=', '');
    window.location.hash = '';
    window.addEventListener('DOMContentLoaded', function() {
      setTimeout(() => {
        let targetBtn = null;
        if (section === 'account') {
          targetBtn = document.querySelector('.settings-section-item:nth-child(1)');
        } else if (section === 'notifications') {
          targetBtn = document.querySelector('.settings-section-item:nth-child(2)');
        } else if (section === 'security') {
          targetBtn = document.querySelector('.settings-section-item:nth-child(3)');
        }
        if (targetBtn) targetBtn.click();
      }, 100);
    });
  }
});
