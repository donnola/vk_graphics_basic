#include "simple_compute.h"

int main()
{
  constexpr int LENGTH = 1000000;
  constexpr int VULKAN_DEVICE_ID = 0;
  #ifdef WIN32
    std::system("cd ../resources/shaders && python compile_simple_compute_shaders.py");
  #else
    std::system("cd ../resources/shaders && python3 compile_simple_compute_shaders.py");
  #endif
  std::shared_ptr<ICompute> app = std::make_unique<SimpleCompute>(LENGTH);
  if(app == nullptr)
  {
    std::cout << "Can't create render of specified type" << std::endl;
    return 1;
  }

  app->InitVulkan(nullptr, 0, VULKAN_DEVICE_ID);

  app->Execute();

  return 0;
}
