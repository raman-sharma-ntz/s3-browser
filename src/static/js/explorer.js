const treeEl = document.getElementById("tree");
const contentEl = document.getElementById("content");
const breadcrumbEl = document.getElementById("breadcrumb");
const downloadAllBtn = document.getElementById("downloadAllBtn");
const disconnectBtn = document.getElementById("disconnectBtn");

let currentPath = "";

const fetchObjects = async (prefix = "") => {
  const res = await fetch(`/api/list?prefix=${encodeURIComponent(prefix)}`);
  return res.json();
};

const downloadAll = () => {
  window.location.href = "/api/download/all";
};

const downloadFolder = (prefix) => {
  window.location.href = `/api/download/folder/${encodeURIComponent(prefix)}`;
};

const downloadFile = (key) => {
  window.location.href = `/api/download/file/${encodeURIComponent(key)}`;
};

const renderBreadcrumb = (path) => {
  breadcrumbEl.innerHTML = "";
  const parts = (path || "").split("/").filter(Boolean);
  let cumulativePath = "";

  const rootLink = document.createElement("span");
  rootLink.textContent = "Root";
  rootLink.className = "cursor-pointer text-gray-400 hover:underline";
  rootLink.addEventListener("click", async () => {
    const rootItems = await fetchObjects("");
    showContent(rootItems, "");
  });
  breadcrumbEl.appendChild(rootLink);

  parts.forEach((part, index) => {
    const span = document.createElement("span");
    span.className = "text-gray-600";
    span.innerHTML = " / ";
    breadcrumbEl.appendChild(span);

    cumulativePath += part + "/";
    const linkPath = cumulativePath;

    const link = document.createElement("span");
    link.textContent = part;
    link.className = "cursor-pointer text-gray-400 hover:underline";
    if (index === parts.length - 1) {
      link.className = "text-white font-bold";
    }
    if (index < parts.length - 1) {
      link.addEventListener("click", async () => {
        const children = await fetchObjects(linkPath);
        showContent(children, linkPath);
      });
    }

    breadcrumbEl.appendChild(link);
  });
};

const createTreeNode = (item) => {
  const node = document.createElement("div");
  node.className =
    "flex items-center gap-2 px-2 py-1 cursor-pointer rounded hover:bg-gray-700 text-sm transition max-w-[200px]";

  const fileName = item.name.split("/").filter(Boolean).pop();

  node.innerHTML =
    item.type === "folder"
      ? `<span>📂</span> 
         <span class="truncate block overflow-hidden whitespace-nowrap text-ellipsis max-w-[160px]" title="${fileName}">
           ${fileName}
         </span>`
      : `<span>📄</span> 
         <span class="truncate block overflow-hidden whitespace-nowrap text-ellipsis max-w-[160px]" title="${fileName}">
           ${fileName}
         </span>`;

  node.addEventListener("click", async (e) => {
    e.stopPropagation();
    if (item.type === "folder") {
      const children = await fetchObjects(item.key);
      showContent(children, item.key);
    } else {
      showFile(item);
    }
  });

  return node;
};

const renderTree = ({ items }, parent) => {
  const container = document.createElement("div");
  container.className = "ml-3 space-y-1";
  items.forEach((item) => {
    const el = createTreeNode(item);
    container.appendChild(el);
  });
  parent.appendChild(container);
};

const showContent = ({ items }, path) => {
  contentEl.innerHTML = "";
  renderBreadcrumb(path);

  currentPath = path;

  const header = document.createElement("div");
  header.className =
    "flex justify-between items-center mb-4 border-b border-gray-700 pb-2";

  const title = document.createElement("h2");
  title.className =
    "text-xl font-semibold text-gray-200 flex items-center gap-2";
  title.textContent = `📂 ${path || "Root"}`;

  const btnGroup = document.createElement("div");
  btnGroup.className = "flex gap-2";

  const folderBtn = document.createElement("button");
  folderBtn.textContent = "⬇️ Download Folder";
  folderBtn.className =
    "bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm font-medium";
  folderBtn.addEventListener("click", () => downloadFolder(path));

  btnGroup.appendChild(folderBtn);

  header.appendChild(title);
  header.appendChild(btnGroup);
  contentEl.appendChild(header);

  const grid = document.createElement("div");
  grid.className = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4";
  contentEl.appendChild(grid);

  items.forEach((item) => {
    const fileName = item.name.split("/").filter(Boolean).pop();
    const card = document.createElement("div");
    card.className =
      "p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition shadow-sm flex flex-col items-center gap-2";

    if (item.type === "folder") {
      card.innerHTML = `
        <div class="text-3xl">📁</div>
        <div class="text-sm truncate w-full text-center overflow-hidden whitespace-nowrap text-ellipsis" title="${fileName}">
          ${fileName}
        </div>`;
      card.addEventListener("click", async () => {
        const children = await fetchObjects(item.key);
        showContent(children, item.key);
      });
    } else {
      card.innerHTML = `
        <div class="text-3xl">📄</div>
        <div class="text-sm truncate w-full text-center overflow-hidden whitespace-nowrap text-ellipsis" title="${fileName}">
          ${fileName}
        </div>`;
      const downloadBtn = document.createElement("button");
      downloadBtn.textContent = "⬇️ Download";
      downloadBtn.className =
        "mt-2 bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded text-xs font-medium";
      downloadBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        downloadFile(item.key);
      });
      card.appendChild(downloadBtn);
      card.addEventListener("click", () => showFile(item));
    }

    grid.appendChild(card);
  });
};

const showFile = (file) => {
  contentEl.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "p-6 bg-gray-800 rounded-lg shadow-md";

  const backBtn = document.createElement("button");
  backBtn.textContent = "⬅️ Back";
  backBtn.className =
    "mb-4 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm font-medium";
  backBtn.addEventListener("click", async () => {
    const items = await fetchObjects(currentPath);
    showContent(items, currentPath);
  });
  wrapper.appendChild(backBtn);

  const title = document.createElement("h2");
  title.className = "text-lg font-semibold mb-4 flex items-center gap-2";
  title.textContent = `📄 ${file.name}`;

  const openBtn = document.createElement("a");
  openBtn.href = file.url;
  openBtn.target = "_blank";
  openBtn.textContent = "Open File";
  openBtn.className =
    "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium inline-block";

  const dlBtn = document.createElement("button");
  dlBtn.textContent = "⬇️ Download File";
  dlBtn.className =
    "ml-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-medium";
  dlBtn.addEventListener("click", () => downloadFile(file.key));

  wrapper.appendChild(title);
  wrapper.appendChild(openBtn);
  wrapper.appendChild(dlBtn);

  contentEl.appendChild(wrapper);
};

(async () => {
  const rootItems = await fetchObjects("");
  renderTree(rootItems, treeEl);
  showContent(rootItems, "");
  downloadAllBtn.addEventListener("click", downloadAll);
  disconnectBtn.addEventListener(
    "click",
    () => (window.location.href = "/disconnect")
  );
})();
